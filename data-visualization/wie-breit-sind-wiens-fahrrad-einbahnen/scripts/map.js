export const map = new maplibregl.Map({
  container: "map",
  style: "./street-labels-style.json",
  attributionControl: false,
  center: [16.3738, 48.2082],
  maxBounds: [
    [16.15990817, 48.09620512],
    [16.58841854, 48.34667157],
  ],
  zoom: 12,
  maxZoom: 21,
  minZoom: 9,
  dragRotate: false,
  pitchWithRotate: false,
  rollEnabled: false,
  touchPitch: false,
});
export const fahrbahnflaechenMinZoom = 18;

export function addMapSources() {
  map.addSource("bezirke", {
    type: "geojson",
    data: "datasets/bezirke.geojson",
  });
  map.addSource("maptiler-labels", {
    type: "vector",
    url: "https://api.maptiler.com/tiles/v3/tiles.json?key=ud46ehKwd6sMnWr8iEjZ",
  });
  map.addSource("perpendiculars", {
    type: "geojson",
    data: "datasets/perpendiculars.geojson",
  });
  map.addSource("perpendicular-near-cursor", {
    type: "geojson",
    data: { type: "FeatureCollection", features: [] },
  });
  map.addSource("fahrbahnflaechen", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [],
    },
  });
  map.addSource("einbahnen", {
    type: "geojson",
    data: "datasets/einbahnen.geojson",
  });
  map.addSource("strassengraph", {
    type: "geojson",
    data: "datasets/strassengraph.geojson",
  });
}

export function addMapLayers() {
  map.addLayer({
    id: "background",
    type: "background",
    paint: {
      "background-color": "white",
    },
  });

  map.addLayer({
    id: "strassengraph",
    source: "strassengraph",
    type: "line",
    paint: {
      "line-color": "#eee",
      "line-width": 2,
    },
  });

  map.addLayer({
    id: "fahrbahnflaechen",
    type: "fill",
    source: "fahrbahnflaechen",
    minzoom: fahrbahnflaechenMinZoom,
    paint: {
      "fill-color": "#eee",
      "fill-outline-color": "transparent",
    },
  });

  ["perpendiculars", "perpendicular-near-cursor"].forEach((sourceId) => {
    map.addLayer({
      id: sourceId,
      source: sourceId,
      type: "line",
      minzoom: fahrbahnflaechenMinZoom,
      paint: {
        "line-color": ["get", "color"],
        "line-width": 2,
        "line-dasharray": [1, 1],
      },
    });

    map.addLayer({
      id: `${sourceId}-labels`,
      type: "symbol",
      source: sourceId,
      minzoom: fahrbahnflaechenMinZoom,
      layout: {
        "text-field": ["get", "fahrbahnflaechen_intersection_length"],
        "text-font": ["Noto Sans Regular"],
        "text-size": 12,
        "text-anchor": "top-right",
      },
      paint: {
        "text-color": ["get", "color"],
        "text-halo-color": "white",
        "text-halo-width": 1,
      },
    });
  });

  map.addLayer({
    id: "einbahnen",
    source: "einbahnen",
    type: "line",
    paint: {
      "line-color": ["get", "color"],
      "line-width": 2,
    },
  });

  map.addLayer({
    id: "street-labels",
    type: "symbol",
    source: "maptiler-labels",
    "source-layer": "transportation_name",
    minzoom: 13.5,
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

  map.addLayer({
    id: "bezirke-label",
    type: "symbol",
    source: "bezirke",
    maxzoom: 13.5,
    layout: {
      "text-field": ["to-string", ["get", "NAME"]],
      "text-font": ["Noto Sans Regular"],
      "text-size": 12,
      "text-anchor": "center",
    },
    paint: {
      "text-color": "#333",
      "text-halo-color": "#fff",
      "text-halo-width": 1,
    },
  });
}
