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

// List of mushroom types (without region prefixes)
const mushrooms = [
    "bolet-bai", "bolet-jaune", "cepe-bronze", "cepe-d-ete", "cepe-de-bordeaux",
    "cepe-des-pins", "chanterelle-en-tube", "collybie-a-pied-veloute", "girolle",
    "lactaire-delicieux", "lepiote-elevee", "morille-commune", "morille-conique",
    "oronge", "pholiote-du-peuplier", "pied-de-mouton", "pleurote-en-huitre",
    "russule-charbonniere", "sparassis-crepu", "trompette-de-la-mort"
];

// Function to load and merge JSON files for both regions
function loadMushroomData(mushroom, suisseLayer, franceLayer) {
    let suisseURL = `cmc/data/suisse-ouest-${mushroom}.json`;
    let franceURL = `cmc/data/rhone-alpes-1-${mushroom}.json`;

    Promise.all([
        fetch(suisseURL).then(res => res.json()).catch(() => null),
        fetch(franceURL).then(res => res.json()).catch(() => null)
    ]).then(([suisseData, franceData]) => {
        if (suisseData && suisseData.data) {
            L.geoJSON(suisseData.data, {
                pointToLayer: function (feature, latlng) {
                    return L.circleMarker(latlng, {
                        radius: 6,
                        fillColor: "red",
                        color: "black",
                        weight: 1,
                        opacity: 1,
                        fillOpacity: 0.8
                    }).bindPopup(`<b>${feature.properties.name}</b>`);
                }
            }).addTo(suisseLayer);
        }

        if (franceData && franceData.data) {
            L.geoJSON(franceData.data, {
                pointToLayer: function (feature, latlng) {
                    return L.circleMarker(latlng, {
                        radius: 6,
                        fillColor: "blue",
                        color: "black",
                        weight: 1,
                        opacity: 1,
                        fillOpacity: 0.8
                    }).bindPopup(`<b>${feature.properties.name}</b>`);
                }
            }).addTo(franceLayer);
        }
    }).catch(error => console.error(`Error loading ${mushroom}:`, error));
}

// Loop through all mushrooms and load them into the correct layers
mushrooms.forEach(mushroom => {
    loadMushroomData(mushroom, suisseLayer, franceLayer);
});

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
