const map = new maplibregl.Map({
  container: "map",
  style: "street-labels-style.json",
  attributionControl: false,
  center: [16.3738, 48.2082],
  maxBounds: [
    [16.20068877, 48.12345476],
    [16.54747745, 48.31978987],
  ],
  zoom: 12,
  maxZoom: 20,
  minZoom: 11.5,
  dragRotate: false,
  pitchWithRotate: false,
  rollEnabled: false,
  touchPitch: false,
});
const maxHeatmapZoom = 17;
const infosLinkElement = document.getElementById("infos-link");
const infosElement = document.getElementById("infos");
const legendElement = document.getElementById("legend");
var selectedTree = null;
const treeDetailsElement = document.getElementById("tree-details");
const gattungElement = document.getElementById("gattung");
const pflanzjahrElement = document.getElementById("pflanzjahr");
const stammumfangElement = document.getElementById("stammumfang");
const hoeheElement = document.getElementById("hoehe");
const kronendurchmesserElement = document.getElementById("kronendurchmesser");

function getPixelCount(metres, zoom) {
  const lat = map.getCenter().lat;
  const earthCircumference = 40075016.686;
  const metersPerPixel =
    (earthCircumference * Math.cos((lat * Math.PI) / 180)) /
    Math.pow(2, zoom + 8);
  return metres / metersPerPixel;
}

function format(number) {
  return new Intl.NumberFormat("de-DE", { useGrouping: "always" }).format(
    number
  );
}

function updateTreeDetails() {
  if (selectedTree) {
    treeDetailsElement.classList.remove("hidden");
    gattungElement.textContent = selectedTree.properties.GATTUNG_ART;
    pflanzjahrElement.textContent = selectedTree.properties.PFLANZJAHR_TXT;
    stammumfangElement.textContent = selectedTree.properties.STAMMUMFANG_TXT;
    hoeheElement.textContent = selectedTree.properties.BAUMHOEHE_TXT;
    kronendurchmesserElement.textContent =
      selectedTree.properties.KRONENDURCHMESSER_TXT;
  } else {
    treeDetailsElement.classList.add("hidden");
  }
}

function deselect() {
  if (selectedTree) {
    map.setFeatureState(
      { source: "baeume", id: selectedTree.id },
      { selected: false }
    );
    selectedTree = null;
  }
}

infosLinkElement.addEventListener("click", () => {
  if (infosElement.classList.contains("visible")) {
    infosElement.classList.remove("visible");
    infosLinkElement.textContent = "?";
  } else {
    infosElement.classList.add("visible");
    infosLinkElement.textContent = "X";
  }
});

map.on("load", async () => {
  map.touchZoomRotate.disableRotation();
  map.on("sourcedata", () => {
    // TODO loading indicator anzeigen
  });
  map.on("idle", () => {
    // TODO loading indicator verstecken
  });

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
      legendElement.classList.add("hidden");
    } else {
      legendElement.classList.remove("hidden");
      treeDetailsElement.classList.add("hidden");
      deselect();
    }
  });
  map.on("click", (e) => {
    deselect();
    const features = map.queryRenderedFeatures(e.point, {
      layers: ["tree_crowns"],
    });
    if (features.length > 0) {
      selectedTree = features[0];
      map.setFeatureState(
        { source: "baeume", id: selectedTree.id },
        { selected: true }
      );
    }
    updateTreeDetails();
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
      "heatmap-weight": ["/", ["get", "KRONENDURCHMESSER"], 8],
      "heatmap-radius": [
        "interpolate",
        ["linear"],
        ["zoom"],
        map.getMinZoom(),
        [
          "*",
          ["get", "KRONENDURCHMESSER"],
          getPixelCount(12, map.getMinZoom()),
        ],
        maxHeatmapZoom,
        ["*", ["get", "KRONENDURCHMESSER"], getPixelCount(3, maxHeatmapZoom)],
      ],
      "heatmap-intensity": [
        "interpolate",
        ["linear"],
        ["zoom"],
        map.getMinZoom(),
        0.25,
        maxHeatmapZoom,
        1,
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
    minzoom: maxHeatmapZoom,
    paint: {
      "circle-radius": [
        "interpolate",
        ["exponential", 2],
        ["zoom"],
        maxHeatmapZoom,
        [
          "*",
          ["/", ["get", "KRONENDURCHMESSER"], 2],
          getPixelCount(1, maxHeatmapZoom),
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
        maxHeatmapZoom,
        getPixelCount(0.5, maxHeatmapZoom),
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
