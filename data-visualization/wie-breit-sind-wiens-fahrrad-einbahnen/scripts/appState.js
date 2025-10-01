import { reactive } from "https://unpkg.com/petite-vue?module";
import { map } from "./map.js";
import { clamp, isTouchscreen } from "./utils.js";

export const App = reactive({
  isReady: false,
  isLoadingFahrbahnflaechen: false,
  isInfosPresented: false,
  isHoveringFahrbahnflaeche: false,
  cursorX: 0,
  cursorY: 0,
  thumbMin: 2.5,
  thumbMax: 4,
  lowerThumbOffset: 0,
  lowerThumbValue: 0,
  upperThumbOffset: 0,
  upperThumbValue: Number.MAX_VALUE,
  isFiltering: false,
  dragging: null,

  get isTouchscreen() {
    return isTouchscreen();
  },
  get lowerThumbLabel() {
    return this.lowerThumbValue == this.thumbMin
      ? "≤2.5"
      : this.lowerThumbValue.toFixed(1);
  },
  get upperThumbLabel() {
    return this.upperThumbValue == Number.MAX_VALUE
      ? "≥4"
      : this.upperThumbValue.toFixed(1);
  },

  startDragging(thumbId) {
    this.dragging = thumbId;
  },

  drag(e) {
    if (!this.dragging) return;
    const rect = document
      .querySelector("#legend-gradient")
      .getBoundingClientRect();
    if (this.dragging === "lower") {
      this.lowerThumbOffset = clamp(
        e.clientX - rect.left,
        0,
        rect.width - this.upperThumbOffset - 15
      );
      this.lowerThumbValue =
        this.thumbMin +
        (this.thumbMax - this.thumbMin) * (this.lowerThumbOffset / rect.width);
    } else {
      this.upperThumbOffset = clamp(
        rect.right - e.clientX,
        0,
        rect.width - this.lowerThumbOffset - 15
      );
      this.upperThumbValue =
        this.thumbMax -
        (this.thumbMax - this.thumbMin) * (this.upperThumbOffset / rect.width);
      if (this.upperThumbValue == this.thumbMax) {
        this.upperThumbValue = Number.MAX_VALUE;
      }
    }
  },

  stopDragging() {
    this.dragging = null;
    this.isFiltering =
      this.lowerThumbValue > this.thumbMin ||
      this.upperThumbValue < Number.MAX_VALUE;
    map.setPaintProperty("einbahnen", "line-color", [
      "case",
      ["<", ["coalesce", ["get", "minimum_width"], 0], this.lowerThumbValue],
      "#e4e4e4ff",
      [">", ["coalesce", ["get", "minimum_width"], 0], this.upperThumbValue],
      "#e4e4e4ff",
      ["get", "color"],
    ]);
  },
});
