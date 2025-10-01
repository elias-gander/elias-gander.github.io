export function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

export function mapToColormapFraction(v, min, max, minFrac = 0, maxFrac = 1) {
  const t = (v - min) / (max - min);
  const tClamped = clamp(t, 0, 1);
  return clamp(tClamped * (maxFrac - minFrac) + minFrac, 0, 1);
}

export function isTouchscreen() {
  return !window.matchMedia("(hover: hover)").matches;
}

export async function fetchFahrbahnflaechen(bbox) {
  const filter = `F_KLASSE IN (21,30,27,28,32) AND BBOX(SHAPE, ${bbox.join(
    ","
  )}, 'EPSG:4326')`;
  const url = `https://data.wien.gv.at/daten/geo?service=WFS&version=1.1.0&request=GetFeature&typeName=ogdwien:FMZKVERKEHR1OGD&srsName=EPSG:4326&outputFormat=json&cql_filter=${encodeURIComponent(
    filter
  )}`;
  const response = await fetch(url);
  return await response.json();
}

export function openStreetview(lngLat) {
  window.open(
    `https://www.google.com/maps?q=&layer=c&cbll=${lngLat.lat},${lngLat.lng}`,
    "_blank"
  );
}
