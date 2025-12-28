const mapEl = document.getElementById("map");

// Only run if map element exists on the page
if (mapEl) {
  // GeoJSON format from database: [lon, lat]
  const coordinates = JSON.parse(mapEl.dataset.coordinates);
  const mapToken = mapEl.dataset.token;

  // Convert from GeoJSON [lon, lat] to Leaflet [lat, lng]
  const lat = coordinates[1] || 28.6139; // lat (default: New Delhi)
  const lng = coordinates[0] || 77.209; // lon (default: New Delhi)

  // Leaflet uses [lat, lng]
  const map = L.map("map").setView([lat, lng], 13);

  // Add Geoapify tile layer
  L.tileLayer(
    "https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?&apiKey=" +
      mapToken,
    {
      attribution:
        'Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | © OpenStreetMap contributors',
      maxZoom: 20,
    }
  ).addTo(map);

  // Custom red marker icon using Geoapify Icon API
  const redIcon = L.icon({
    iconUrl: `https://api.geoapify.com/v2/icon?type=material&color=%23ff5722&size=64&apiKey=${mapToken}`,
    iconSize: [38, 56],
    iconAnchor: [19, 56],
    popupAnchor: [0, -56],
  });

  // Add marker - Leaflet uses [lat, lng]
  const marker = L.marker([lat, lng], { icon: redIcon }).addTo(map);
  marker
    .bindPopup(
      "<b>" + mapEl.dataset.title + "</b><br>" + mapEl.dataset.location
    )
    .openPopup();
}
