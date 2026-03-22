import { createApp, reactive } from "https://unpkg.com/petite-vue?module";

const zstIdsWithPhoto = [
  1078, 1607, 1621, 1222, 1204, 1625, 1214, 1217, 1203, 1210, 1131, 1220, 1205,
  1616, 1615, 1170, 1627, 1213, 1075, 1089, 1096, 1206, 1209, 1219, 1223, 1600,
  1613, 1614,
];
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
  attributionControl: false,
});
const markers = L.markerClusterGroup({
  maxClusterRadius: 30,
  polygonOptions: {
    color: "red",
  },
});
let currentSelectedMarker = null;

window.App = reactive({
  selectedRecord: null,
  isCardPresented: false,
  isInfosPresented: false,

  get hasPhoto() {
    return zstIdsWithPhoto.includes(this.selectedRecord?.ZST_ID);
  },
  get dtvms() {
    return (Math.round(this.selectedRecord?.DTVMS / 100) * 100)
      .toLocaleString("de-AT")
      .replace(".", " ");
  },
  get trend() {
    return (
      (this.selectedRecord?.TREND > 0 ? "+" : "") +
      (this.selectedRecord?.TREND * 100).toLocaleString("de-AT", {
        maximumFractionDigits: 1,
      }) +
      " %"
    );
  },
  get lkwratio() {
    return (
      (this.selectedRecord?.LKWRATIO * 100).toLocaleString("de-AT", {
        maximumFractionDigits: 1,
      }) + " %"
    );
  },

  async showCard(record) {
    this.isCardPresented = true;
    await new Promise(requestAnimationFrame);
    document.getElementById("photo").src =
      `assets/photos/${zstIdsWithPhoto.includes(record.ZST_ID) ? record.ZST_ID : "placeholder"}.jpg`;
    document.getElementById("bezirkswappen").src =
      `assets/bezirkswappen/pngs/${record.PLZ}.png`;
    const startTime = Date.now();
    await Promise.all([
      waitForImage(document.getElementById("photo")),
      waitForImage(document.getElementById("bezirkswappen")),
    ]);
    const elapsedTime = Date.now() - startTime;
    const remainingDelay = Math.max(0, 250 - elapsedTime);
    await new Promise((r) => setTimeout(r, remainingDelay));
    this.selectedRecord = record;
  },
  async hideCard() {
    this.selectedRecord = null;
    await new Promise((r) => setTimeout(r, 250));
    this.isCardPresented = false;
  },
});
createApp(window.App).mount();

function waitForImage(imgElem) {
  return new Promise((res) => {
    if (imgElem.complete) {
      return res();
    }
    imgElem.onload = () => res();
    imgElem.onerror = () => res();
  });
}

function createMarkerIcon(label, isSelected) {
  return L.divIcon({
    className: "marker-icon",
    html: `
      <svg viewBox="0 0 50 24" width="50" height="24" xmlns="http://www.w3.org/2000/svg">
        <text x="50%" y="56%" text-anchor="middle" dominant-baseline="middle" font-family="Orbitron, sans-serif" font-size="20" font-weight="1000" fill="${isSelected ? "white" : "red"}" stroke="${isSelected ? "red" : "white"}" stroke-width="5" paint-order="stroke"}>
          ${label}
        </text>
      </svg>
    `,
    iconSize: [50, 24],
    iconAnchor: [25, 12],
  });
}

L.tileLayer(
  "https://tiles-eu.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}{r}.png?api_key=9cb5a2cf-4b74-4e87-ade1-320768b874d4",
  {
    maxZoom: 18,
  },
).addTo(map);

import data from "./quartett.json" with { type: "json" };
data.forEach((record) => {
  const marker = L.marker(
    [parseFloat(record.LATITUDE), parseFloat(record.LONGITUDE)],
    {},
  );
  marker.categoryId = record.CATEGORY_ID;
  marker.setIcon(createMarkerIcon("?", false));
  marker.on("click", async (e) => {
    e.originalEvent.stopPropagation();
    if (App.selectedRecord?.ZST_ID === record.ZST_ID) {
      return;
    }

    marker.setIcon(createMarkerIcon(record.CATEGORY_ID, true));
    if (currentSelectedMarker) {
      currentSelectedMarker.setIcon(
        createMarkerIcon(currentSelectedMarker.categoryId, false),
      );
      currentSelectedMarker = null;
      await App.hideCard();
    }

    currentSelectedMarker = marker;
    await App.showCard(record);
  });

  markers.addLayer(marker);
});
map.addLayer(markers);

document.addEventListener("click", async (event) => {
  const cardContainer = document.getElementById("card-container");
  if (!cardContainer.contains(event.target)) {
    await App.hideCard();
    if (currentSelectedMarker) {
      currentSelectedMarker.setIcon(
        createMarkerIcon(currentSelectedMarker.categoryId, false),
      );
      currentSelectedMarker = null;
    }
  }
});
