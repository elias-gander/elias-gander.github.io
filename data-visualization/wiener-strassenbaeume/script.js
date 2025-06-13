import { createApp, reactive } from "https://unpkg.com/petite-vue?module";

const metricColors = ["#FF00E6", "#AA0099", "#55004D", "#000000"];
const baeumeCount = 91178;

window.App = reactive({
  isInfosPresented: false,
  isLegendPresented: true,
  selectedTree: null,
  explanationTextId: null,

  get gattungPercentileText() {
    if (this.selectedTree?.properties?.GATTUNG_ART == "unbekannt") {
      return "";
    }
    return `${this.selectedTree?.properties?.GATTUNG_ART_FREQUENCY} Exemplare`;
  },

  get alterPercentileText() {
    return this.getPercentileText(
      this.selectedTree?.properties?.ALTER_PERCENTILE
    );
  },

  get stammdurchmesserPercentileText() {
    return this.getPercentileText(
      this.selectedTree?.properties?.STAMMDURCHMESSER_PERCENTILE
    );
  },

  get hoehePercentileText() {
    return this.getPercentileText(
      this.selectedTree?.properties?.BAUMHOEHE_PERCENTILE
    );
  },

  get kronendurchmesserPercentileText() {
    return this.getPercentileText(
      this.selectedTree?.properties?.KRONENDURCHMESSER_PERCENTILE
    );
  },

  get gattungColor() {
    const f = this.selectedTree?.properties?.GATTUNG_ART_FREQUENCY;
    if (f < 10) {
      return metricColors[0];
    } else if (f < 100) {
      return metricColors[1];
    } else if (f < 1000) {
      return metricColors[2];
    } else {
      return metricColors[3];
    }
  },

  get alterColor() {
    return this.getMetricColor(this.selectedTree?.properties?.ALTER_PERCENTILE);
  },

  get stammdurchmesserColor() {
    return this.getMetricColor(
      this.selectedTree?.properties?.STAMMDURCHMESSER_PERCENTILE
    );
  },

  get hoeheColor() {
    return this.getMetricColor(
      this.selectedTree?.properties?.BAUMHOEHE_PERCENTILE
    );
  },

  get kronendurchmesserColor() {
    return this.getMetricColor(
      this.selectedTree?.properties?.KRONENDURCHMESSER_PERCENTILE
    );
  },

  get gattungPercentileExplanationText() {
    const fAbs = this.selectedTree?.properties?.GATTUNG_ART_FREQUENCY;
    const fRel100 = Math.round(
      (this.selectedTree?.properties?.GATTUNG_ART_FREQUENCY / baeumeCount) * 100
    );
    return `${fAbs} bzw. ${fRel100}% der ${baeumeCount} Straßenbäume sind dieser Gattung`;
  },

  get alterPercentileExplanationText() {
    return `${this.selectedTree?.properties?.ALTER_PERCENTILE}% der Straßenbäume sind jünger oder gleich alt`;
  },

  get stammdurchmesserPercentileExplanationText() {
    return `${this.selectedTree?.properties?.STAMMDURCHMESSER_PERCENTILE}% der Straßenbäume haben einen dünneren oder gleich dicken Stamm`;
  },

  get hoehePercentileExplanationText() {
    return `${this.selectedTree?.properties?.BAUMHOEHE_PERCENTILE}% der Straßenbäume sind niedriger oder gleich hoch`;
  },

  get kronendurchmesserPercentileExplanationText() {
    return `${this.selectedTree?.properties?.KRONENDURCHMESSER_PERCENTILE}% der Straßenbäume sind schmäler oder gleich breit`;
  },

  getMetricColor(p) {
    if (p > 90) {
      return metricColors[0];
    } else if (p > 75) {
      return metricColors[1];
    } else if (p > 50) {
      return metricColors[2];
    } else {
      return metricColors[3];
    }
  },

  getPercentileText(p) {
    if (p == null) {
      return "";
    }
    return `P(${p})`;
  },
});

createApp(window.App).mount();

const map = new maplibregl.Map({
  container: "map",
  style: "street-labels-style.json",
  attributionControl: false,
  center: [16.3738, 48.2082],
  maxBounds: [
    [16.15990817, 48.09620512],
    [16.58841854, 48.34667157],
  ],
  zoom: 12,
  maxZoom: 20,
  minZoom: 12,
  dragRotate: false,
  pitchWithRotate: false,
  rollEnabled: false,
  touchPitch: false,
});
const minTreeCrownZoom = 17;
const maxHeatmapZoom = 17.5;

function getPixelCount(metres, zoom) {
  const lat = map.getCenter().lat;
  const earthCircumference = 40075016.686;
  const metersPerPixel =
    (earthCircumference * Math.cos((lat * Math.PI) / 180)) /
    Math.pow(2, zoom + 8);
  return metres / metersPerPixel;
}

function deselect() {
  if (App.selectedTree) {
    map.setFeatureState(
      { source: "baeume", id: App.selectedTree.id },
      { selected: false }
    );
    App.selectedTree = null;
  }
}

map.on("load", async () => {
  map.touchZoomRotate.disableRotation();

  map.on(
    "mousemove",
    "tree_crowns",
    () => (map.getCanvas().style.cursor = "help")
  );
  map.on("mouseleave", "tree_crowns", () => {
    map.getCanvas().style.cursor = "";
  });
  map.on("zoom", () => {
    if (map.getZoom() > maxHeatmapZoom) {
      App.isLegendPresented = false;
    } else if (map.getZoom() < minTreeCrownZoom) {
      App.isLegendPresented = true;
      App.isTreeDetailsPresented = false;
      deselect();
    }
  });
  map.on("click", (e) => {
    deselect();
    const features = map.queryRenderedFeatures(e.point, {
      layers: ["tree_crowns"],
    });
    if (features.length > 0) {
      App.selectedTree = features[0];
      map.setFeatureState(
        { source: "baeume", id: App.selectedTree.id },
        { selected: true }
      );
    }
  });

  map.addSource("inverted_strassenflaechen", {
    type: "geojson",
    data: "inverted_strassenflaechen.geojson",
  });
  map.addSource("baeume", {
    type: "geojson",
    data: "baeume.geojson",
  });
  map.addSource("maptiler-labels", {
    type: "vector",
    url: "https://api.maptiler.com/tiles/v3/tiles.json?key=ud46ehKwd6sMnWr8iEjZ",
  });

  map.addLayer({
    id: "strassenflaechen_background",
    type: "background",
    paint: {
      "background-color": "rgb(230, 230, 230)",
    },
  });
  map.addLayer({
    id: "baeume_heatmap",
    type: "heatmap",
    source: "baeume",
    maxzoom: maxHeatmapZoom,
    paint: {
      "heatmap-color": [
        "interpolate",
        ["linear"],
        ["heatmap-density"],
        0,
        "rgb(230, 230, 230)",
        1,
        "rgb(21, 165, 88)",
      ],
      "heatmap-weight": ["/", ["get", "KRONENDURCHMESSER"], 22], // maximaler kronendurchmesser
      "heatmap-radius": [
        "interpolate",
        ["exponential", 2],
        ["zoom"],
        map.getMinZoom(),
        getPixelCount(300, map.getMinZoom()),
        maxHeatmapZoom,
        getPixelCount(100, maxHeatmapZoom),
      ],
      "heatmap-intensity": [
        "interpolate",
        ["linear"],
        ["zoom"],
        map.getMinZoom(),
        0.33,
        maxHeatmapZoom,
        1,
      ],
      "heatmap-opacity": [
        "interpolate",
        ["linear"],
        ["zoom"],
        minTreeCrownZoom,
        1,
        maxHeatmapZoom,
        0,
      ],
    },
  });
  map.addLayer({
    id: "inverted_strassenflaechen_mask",
    type: "fill-extrusion",
    source: "inverted_strassenflaechen",
    paint: {
      "fill-extrusion-color": "rgba(255, 255, 255, 1)",
      "fill-extrusion-height": 0,
    },
  });
  map.addLayer({
    id: "tree_crowns",
    type: "circle",
    source: "baeume",
    minzoom: minTreeCrownZoom,
    paint: {
      "circle-radius": [
        "interpolate",
        ["exponential", 2],
        ["zoom"],
        minTreeCrownZoom,
        [
          "*",
          ["/", ["get", "KRONENDURCHMESSER"], 2],
          getPixelCount(1, minTreeCrownZoom),
        ],
        map.getMaxZoom(),
        [
          "*",
          ["/", ["get", "KRONENDURCHMESSER"], 2],
          getPixelCount(1, map.getMaxZoom()),
        ],
      ],
      "circle-stroke-width": [
        "interpolate",
        ["exponential", 2],
        ["zoom"],
        minTreeCrownZoom,
        getPixelCount(0.5, minTreeCrownZoom),
        map.getMaxZoom(),
        getPixelCount(0.5, map.getMaxZoom()),
      ],
      "circle-stroke-color": "rgb(21, 165, 88)",
      "circle-color": [
        "case",
        ["boolean", ["feature-state", "selected"], false],
        "rgb(21, 165, 88)",
        "rgba(21, 165, 88, 0.5)",
      ],
      "circle-opacity": [
        "interpolate",
        ["linear"],
        ["zoom"],
        minTreeCrownZoom,
        0,
        maxHeatmapZoom,
        1,
      ],
      "circle-stroke-opacity": [
        "interpolate",
        ["linear"],
        ["zoom"],
        minTreeCrownZoom,
        0,
        maxHeatmapZoom,
        1,
      ],
    },
  });
  map.addLayer({
    id: "street-labels",
    type: "symbol",
    source: "maptiler-labels",
    "source-layer": "transportation_name",
    layout: {
      "text-field": ["get", "name"],
      "symbol-placement": "line",
      "text-font": ["Noto Sans Regular"],
      "text-size": 12,
    },
    paint: {
      "text-color": "#333",
      "text-halo-color": "#fff",
      "text-halo-width": 1,
    },
  });
});
