const zstIdsWithPhoto = [1078, 1607, 1621, 1222, 1204, 1625, 1214, 1217, 1203, 1210, 1131, 1220, 1205, 1616, 1615, 1170, 1627, 1213]
const map = L.map("map", {
  center: [48.2082, 16.3738],
  zoom: 12,
  maxZoom: 18,
  minZoom: 10,
  maxBounds: [
    [48.0, 16.0],
    [48.4, 16.8],
  ],
  tap: false,
  zoomControl: false,
  attributionControl: false
});
const markers = L.markerClusterGroup({
  polygonOptions: {
    color: "red",
  },
});
const infosLink = document.getElementById("infos-link");
const infos = document.getElementById("infos");
const card = document.getElementById("card");
const noPhotoWatermark = document.getElementById("no-photo-watermark");
var openCardZstId = undefined;

async function showCard(record) {
  card.style.visibility = "visible";

  openCardZstId = record.ZST_ID;
  const hasPhoto = zstIdsWithPhoto.includes(record.ZST_ID);
  if (!hasPhoto) {
    noPhotoWatermark.style.visibility = "visible";
  } else {
    noPhotoWatermark.style.visibility = "hidden";
  }

  document.getElementById("category-id").textContent = record.CATEGORY_ID;
  document.getElementById("category").textContent = record.CATEGORY;
  document.getElementById("photo").src =  
    "assets/photos/" + (hasPhoto ? record.ZST_ID : "placeholder") + ".jpg";
  await waitForImage(document.getElementById("photo"));
  document.getElementById("location-name").textContent = record.ZST_NAME;
  document.getElementById("description").textContent = record.DESCRIPTION;
  document.getElementById("plz").textContent = record.PLZ;
  document.getElementById("bezirkswappen").src =
    "assets/bezirkswappen/pngs/" + record.PLZ + ".png";
  await waitForImage(document.getElementById("bezirkswappen"));
  document.getElementById("link-1").textContent = record.LINK1;
  document.getElementById("link-2").textContent = record.LINK2;
  document.getElementById("link-3").textContent = record.LINK3;
  document.getElementById("dtvms").textContent = (
    Math.round(record.DTVMS / 100) * 100
  )
    .toLocaleString("de-AT")
    .replace(".", " ");
  document.getElementById("lkwratio").textContent =
    (record.LKWRATIO * 100).toLocaleString("de-AT", {
      maximumFractionDigits: 1,
    }) + " %";
  document.getElementById("trend").textContent =
    (record.TREND > 0 ? "+" : "") +
    (record.TREND * 100).toLocaleString("de-AT", {
      maximumFractionDigits: 1,
    }) +
    " %";
  document.getElementById("lanes").textContent = record.LANES;
  
  card.classList.remove("flipped");
}

function waitForImage(imgElem) {
    return new Promise(res => {
        if (imgElem.complete) {
            return res();
        }
        imgElem.onload = () => res();
        imgElem.onerror = () => res();
    });
}

function hideCard() {
  openCardZstId = undefined;
  card.classList.add("flipped");
  setTimeout(() => (card.style.visibility = "hidden"), 250);
}

function deselectAllMarkers() {
  Array.from(document.getElementsByClassName("crosshair-icon")).forEach(marker => marker.classList.remove("selected"));
}

L.tileLayer(
  "https://tiles-eu.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}{r}.png?api_key=9cb5a2cf-4b74-4e87-ade1-320768b874d4",
  {
    maxZoom: 18,
  }
).addTo(map);

import data from "./quartett.json" with { type: "json"};
data.forEach((record) => {
  const crosshairIcon = L.divIcon({
    className: "crosshair-icon",
    html: `<svg width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <rect style="fill:white" width="100%" height="20%" x="0%" y="40%" />
      <rect style="fill:white" width="20%" height="100%" x="40%" y="0%" />
      <rect style="fill:red" width="90%" height="10%" x="5%" y="45%" />
      <rect style="fill:red" width="10%" height="90%" x="45%" y="5%" />
    </svg>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });

  const marker = L.marker(
    [parseFloat(record.LATITUDE), parseFloat(record.LONGITUDE)],
    {
      icon: crosshairIcon,
    }
  );

  marker.on("click", (e) => {
    e.originalEvent.stopPropagation();
    if (openCardZstId === record.ZST_ID) {
      return;
    }

    deselectAllMarkers();
    if (openCardZstId) {
      hideCard();
      setTimeout(() => {
        e.target._icon.classList.add("selected");
        showCard(record)
      }, 250);
    } else {
      e.target._icon.classList.add("selected");
      showCard(record);
    }
  });

  markers.addLayer(marker);
});
map.addLayer(markers);

document.addEventListener("click", (event) => {
  if (!card.contains(event.target)) {
    hideCard();
    deselectAllMarkers();
  }
});

infosLink.addEventListener("click", (event) => {
  event.stopPropagation();
  if (infos.classList.contains("visible")) {
    infos.classList.remove("visible");
    infosLink.textContent = "?";
  } else {
    infos.classList.add("visible");
    infosLink.textContent = "X";
  }
});