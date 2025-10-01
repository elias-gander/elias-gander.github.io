import {
  map,
  fahrbahnflaechenMinZoom,
  addMapLayers,
  addMapSources,
} from "./map.js";
import {
  isTouchscreen,
  fetchFahrbahnflaechen,
  openStreetview,
  mapToColormapFraction,
} from "./utils.js";
import { getPerpendicular, clip, snapToNearestLine } from "./geoUtils.js";
import { App } from "./appState.js";
import { createApp } from "https://unpkg.com/petite-vue?module";

window.App = App;
createApp(App).mount();

map.on("load", async () => {
  map.touchZoomRotate.disableRotation();

  map.on("sourcedata", function waitForSource(e) {
    if (e.sourceId === "strassengraph" && e.isSourceLoaded) {
      App.isReady = true;
      map.off("sourcedata", waitForSource);
    }
  });
  map.on("moveend", async (_) => {
    if (map.getZoom() >= fahrbahnflaechenMinZoom) {
      App.isLoadingFahrbahnflaechen = true;
      const bounds = map.getBounds();
      const bbox = [
        bounds.getWest(),
        bounds.getSouth(),
        bounds.getEast(),
        bounds.getNorth(),
      ];
      map
        .getSource("fahrbahnflaechen")
        .setData(await fetchFahrbahnflaechen(bbox));
      App.isLoadingFahrbahnflaechen = false;
    }
  });
  if (isTouchscreen()) {
    map.on("move", (_) => {
      const rect = map.getCanvas().getBoundingClientRect();
      App.cursorX = rect.left + rect.width / 2;
      App.cursorY = rect.top + rect.height / 2;
      App.isHoveringFahrbahnflaeche =
        map.queryRenderedFeatures([App.cursorX, App.cursorY], {
          layers: ["fahrbahnflaechen"],
        }).length > 0;
      if (map.getZoom() >= fahrbahnflaechenMinZoom) {
        updatePerpendicular(map.unproject([App.cursorX, App.cursorY]));
      }
    });
    document
      .getElementById("streetview-hint")
      .addEventListener("click", (e) => {
        openStreetview(map.unproject([e.clientX, e.clientY]));
      });
  } else {
    map.getCanvas().addEventListener("mousemove", (e) => {
      App.cursorX = e.clientX;
      App.cursorY = e.clientY;
    });
    map.on("mouseenter", "fahrbahnflaechen", () => {
      App.isHoveringFahrbahnflaeche = true;
      map.getCanvas().style.cursor = "crosshair";
    });
    map.on("mouseleave", "fahrbahnflaechen", () => {
      App.isHoveringFahrbahnflaeche = false;
      map.getCanvas().style.cursor = "";
    });
    map.on("mousemove", (e) => {
      if (map.getZoom() >= fahrbahnflaechenMinZoom) {
        updatePerpendicular(e.lngLat);
      }
    });
    map.on("click", "fahrbahnflaechen", (e) => {
      openStreetview(e.lngLat);
    });
  }

  addMapSources();

  addMapLayers();
});

function updatePerpendicular(lngLat) {
  function clearSource() {
    map
      .getSource("perpendicular-near-cursor")
      .setData({ type: "FeatureCollection", features: [] });
  }

  const [point, line] = snapToNearestLine(
    lngLat,
    map.querySourceFeatures("einbahnen"),
    10
  );
  if (point == null) {
    clearSource();
    return;
  }

  const perpendicular = getPerpendicular(line, point, 20);
  const clippedPerpendicular = clip(
    perpendicular,
    map.querySourceFeatures("fahrbahnflaechen"),
    point
  );
  if (clippedPerpendicular == null) {
    clearSource();
    return;
  }

  const length = turf
    .length(clippedPerpendicular, { units: "meters" })
    .toFixed(1);
  map.getSource("perpendicular-near-cursor").setData({
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: clippedPerpendicular.geometry,
        properties: {
          fahrbahnflaechen_intersection_length: `${length} m`,
          color: evaluate_cmap(
            mapToColormapFraction(length, App.thumbMin, App.thumbMax, 0.3, 1),
            "Blues",
            false
          ),
        },
      },
    ],
  });
}
