const map = L.map("map", {
  center: [48.2082, 16.3738],
  zoom: 12,
  maxZoom: 18,
  minZoom: 10,
  maxBounds: [
    [48.0, 16.2],
    [48.4, 16.6],
  ],
  tap: false,
});
const markers = L.markerClusterGroup({
  polygonOptions: {
    color: "red",
  },
});
const infosLink = document.getElementById("infos-link");
const infos = document.getElementById("infos");
const card = document.getElementById("card");
var openCardZstId = undefined;

function showCard(record) {
  openCardZstId = record.ZST_ID;

  document.getElementById("category-id").textContent = record.CATEGORY_ID;
  document.getElementById("category").textContent = record.CATEGORY;
  document.getElementById("photo").src =
    "assets/photos/" + record.ZST_ID + ".jpg";
  document.getElementById("location-name").textContent = record.ZST_NAME;
  document.getElementById("description").textContent = record.DESCRIPTION;
  document.getElementById("plz").textContent = record.PLZ;
  document.getElementById("bezirkswappen").src =
    "assets/bezirkswappen/pngs/" + record.PLZ + ".png";
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
  
  card.style.visibility = "visible";
  card.classList.remove("flipped");
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
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://stamen.com">Stamen Design</a>',
    maxZoom: 19,
  }
).addTo(map);

import data from "./quartett.json" with { type: "json"};
data.forEach((record) => {
  const crosshairIcon = L.divIcon({
    className: "crosshair-icon",
    iconSize: [24, 24],
    iconAnchor: [12, 24],
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