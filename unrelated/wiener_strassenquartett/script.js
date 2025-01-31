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

L.tileLayer(
  "https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}{r}.png",
  {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://stamen.com">Stamen Design</a>',
    maxZoom: 19,
  }
).addTo(map);

const markers = L.markerClusterGroup({
  polygonOptions: {
    color: "red",
  },
});

const crosshairIcon = L.divIcon({
  className: "crosshair-icon",
  iconSize: [20, 20],
  iconAnchor: [10, 20],
});

const card = document.getElementById("card");

function showCard() {
  card.style.visibility = "visible";
  card.classList.remove("flipped");
}

function hideCard() {
  card.classList.add("flipped");
  setTimeout(() => (card.style.visibility = "hidden"), 250);
}

import data from "./quartett.json" with { type: "json" };
data.forEach((record) => {
  const marker = L.marker(
    [parseFloat(record.LATITUDE), parseFloat(record.LONGITUDE)],
    {
      icon: crosshairIcon,
    }
  );

  marker.on("click", (e) => {
    e.originalEvent.stopPropagation();

    var timeout = 0;
    if (card.style.visibility === "visible") {
      hideCard();
      timeout = 250;
    }

    setTimeout(() => {
      document.getElementById("category-id").textContent = record.CATEGORY_ID;
      document.getElementById("category").textContent = record.CATEGORY;
      document.getElementById("location-name").textContent = record.ZST_NAME;
      document.getElementById("description").textContent = record.DESCRIPTION;
      document.getElementById("plz").textContent = record.PLZ;
      document.getElementById("bezirkswappen").src =
        "bezirkswappen/pngs/" + record.PLZ + ".png";
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

      showCard();
    }, timeout);
  });

  markers.addLayer(marker);
});
map.addLayer(markers);

document.addEventListener("click", (event) => {
  if (card.style.visibility !== "hidden" && !card.contains(event.target)) {
    hideCard();
  }
});
