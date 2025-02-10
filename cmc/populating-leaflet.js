// Initialize the Leaflet map
let map = L.map('map').setView([46.451, 6.239], 11);

// Add OpenStreetMap tiles
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Create layer groups for each region
let suisseLayer = L.layerGroup();
let franceLayer = L.layerGroup();

// Define colors for each region
const suisseColor = "red";
const franceColor = "blue";

// Add layer control to toggle visibility
let layerControl = L.control.layers(null, {
    "Suisse": suisseLayer,
    "France": franceLayer
}, { collapsed: false }).addTo(map);

// Function to load and add JSON data to the map
function loadJSON(file, layer, color, layerName) {
    fetch('data/' + file)
        .then(response => response.json())
        .then(data => {
            let geoJsonLayer = L.geoJSON(data.data, {
                pointToLayer: function (feature, latlng) {
                    return L.circleMarker(latlng, {
                        radius: 6,
                        fillColor: color,
                        color: "black",
                        weight: 1,
                        opacity: 1,
                        fillOpacity: 0.8
                    }).bindPopup(`<b>${feature.properties.name}</b>`);
                }
            });

            // Add to layer group
            geoJsonLayer.addTo(layer);

            // Add layer to control toggle
            layerControl.addOverlay(layer, layerName);
        })
        .catch(error => console.error('Error loading JSON:', error));
}

// Load JSON layers and add them to the toggle menu
loadJSON('suisse-ouest.json', suisseLayer, suisseColor, "Suisse");
loadJSON('rhone-alpes-1.json', franceLayer, franceColor, "France");

// Add layers to the map initially (optional)
suisseLayer.addTo(map);
franceLayer.addTo(map);

// Geolocation - Show user's current position
if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
        function(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            let userMarker = L.marker([lat, lon]).addTo(map);
            userMarker.bindPopup("You are here!").openPopup();

            map.setView([lat, lon], 13);
        },
        function(error) {
            console.error("Error getting location:", error);
        }
    );
} else {
    alert("Geolocation is not supported by your browser.");
}
