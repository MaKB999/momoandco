// Initialize the Leaflet map
let map = L.map('map').setView([46.451, 6.239], 11);

// Add OpenStreetMap tiles
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Create layer groups for each region
let suisseOuestLayer = L.layerGroup().addTo(map);
let rhoneAlpesLayer = L.layerGroup().addTo(map);

// Define colors for each region
const suisseOuestColor = "red";
const rhoneAlpesColor = "blue";

// Function to load and add JSON data to the map
function loadJSON(file, layer, color) {
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
            geoJsonLayer.addTo(layer);
        })
        .catch(error => console.error('Error loading JSON:', error));
}

// Load both JSON files with designated colors
loadJSON('suisse-ouest.json', suisseOuestLayer, suisseOuestColor);
loadJSON('rhone-alpes-1.json', rhoneAlpesLayer, rhoneAlpesColor);

// Add layer control to toggle visibility
L.control.layers(null, {
    "Suisse-Ouest Mushrooms": suisseOuestLayer,
    "Rhone-Alpes Mushrooms": rhoneAlpesLayer
}, { collapsed: false }).addTo(map);

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
