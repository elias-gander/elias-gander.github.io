proj4.defs(
  "EPSG:31256",
  "+proj=tmerc +lat_0=0 +lon_0=16.3333333333333 +k=1 +x_0=0 +y_0=-5000000 +ellps=bessel +towgs84=577.326,90.129,463.919,5.137,1.474,5.297,2.4232 +units=m +no_defs +type=crs"
);

const proj4326to31256 = proj4("EPSG:4326", "EPSG:31256");

export function snapToNearestLine(fromLngLat, lineFeatures, maxDistanceMeters) {
  const fromPoint = turf.point([fromLngLat.lng, fromLngLat.lat]);
  let snapped = [null, null];
  let minDistance = Number.MAX_VALUE;

  lineFeatures.forEach((feature) => {
    let lines = [];
    if (feature.geometry.type === "LineString") {
      lines.push(feature.geometry.coordinates);
    } else if (feature.geometry.type === "MultiLineString") {
      feature.geometry.coordinates.forEach((lineCoords) => {
        lines.push(lineCoords);
      });
    }

    lines.forEach((coords) => {
      for (let i = 0; i < coords.length - 1; i++) {
        const line = turf.lineString([coords[i], coords[i + 1]]);
        const nearestPointOnLine = turf.nearestPointOnLine(line, fromPoint);
        const dist = turf.distance(fromPoint, nearestPointOnLine, {
          units: "meters",
        });

        if (dist < minDistance && dist <= maxDistanceMeters) {
          minDistance = dist;
          snapped = [
            nearestPointOnLine.geometry.coordinates,
            [coords[i], coords[i + 1]],
          ];
        }
      }
    });
  });

  return snapped;
}

export function getPerpendicular(line, point, lengthMeters) {
  const p = proj4326to31256.forward(point);
  const a = proj4326to31256.forward(line[0]);
  const b = proj4326to31256.forward(line[1]);

  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.sqrt(dx * dx + dy * dy);

  const perp = [-dy / len, dx / len];

  const p1 = [
    p[0] + (perp[0] * lengthMeters) / 2,
    p[1] + (perp[1] * lengthMeters) / 2,
  ];
  const p2 = [
    p[0] - (perp[0] * lengthMeters) / 2,
    p[1] - (perp[1] * lengthMeters) / 2,
  ];

  return turf.lineString([
    proj4326to31256.inverse(p1),
    proj4326to31256.inverse(p2),
  ]);
}

export function clip(line, byPolygonFeatures, point) {
  const lineBbox = turf.bbox(line);
  const nearbyPolygons = byPolygonFeatures.filter((polygon) => {
    const polygonBbox = turf.bbox(polygon);
    return !(
      polygonBbox[2] < lineBbox[0] ||
      polygonBbox[0] > lineBbox[2] ||
      polygonBbox[3] < lineBbox[1] ||
      polygonBbox[1] > lineBbox[3]
    );
  });

  if (nearbyPolygons.length === 0) return null;

  let mergedPolygon = turf.polygon(nearbyPolygons[0].geometry.coordinates);
  for (let i = 1; i < nearbyPolygons.length; i++) {
    mergedPolygon = turf.union(
      mergedPolygon,
      turf.polygon(nearbyPolygons[i].geometry.coordinates)
    );
  }
  return getLongestSegment(
    overlappingSegments(line, mergedPolygon),
    point,
    0.5
  );
}

function overlappingSegments(line, polygon) {
  const split = turf.lineSplit(line, polygon);
  if (split.features.length < 2) {
    return turf.featureCollection([line]);
  }

  const overlappingSegments = split.features.filter((seg) => {
    const length = turf.length(seg, { units: "meters" });
    return turf.booleanWithin(
      turf.lineSliceAlong(seg, length * 0.1, length * 0.9, { units: "meters" }),
      polygon
    );
  });
  return turf.featureCollection(overlappingSegments);
}

function getLongestSegment(lineCollection, point, maxDistanceMeters) {
  if (!lineCollection || lineCollection.features.length === 0 || !point)
    return null;

  const pointBuffer = turf.buffer(turf.point(point), maxDistanceMeters, {
    units: "meters",
  });
  const closeSegments = lineCollection.features.filter((seg) =>
    turf.booleanIntersects(seg, pointBuffer)
  );

  if (closeSegments.length === 0) return null;

  return closeSegments.reduce((longest, seg) =>
    turf.length(seg, { units: "meters" }) >
    turf.length(longest, { units: "meters" })
      ? seg
      : longest
  );
}
