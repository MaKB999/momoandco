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
let userMarkers = L.layerGroup().addTo(map);

// Define colors for each region
const suisseColor = "blue";
const franceColor = "blue";
const userLocationColor = "red"; // Change cursor geolocation to red

// Add layer control to toggle visibility
let layerControl = L.control.layers(null, {
    "Suisse": suisseLayer,
    "France": franceLayer,
    "My Markers": userMarkers
}, { collapsed: false }).addTo(map);

// List of mushroom types with accents
const mushrooms = [
    "bolet-bai|Bolet Bai", "bolet-jaune|Bolet Jaune", "cepe-bronze|Cèpe Bronzé", "cepe-d-ete|Cèpe d'Été", "cepe-de-bordeaux|Cèpe de Bordeaux",
    "cepe-des-pins|Cèpe des Pins", "chanterelle-en-tube|Chanterelle en Tube", "collybie-a-pied-veloute|Collybie à Pied Velouté", "girolle|Girolle",
    "lactaire-delicieux|Lactaire Délicieux", "lepiote-elevee|Lépiote Élevée", "morille-commune|Morille Commune", "morille-conique|Morille Conique",
    "oronge|Oronge", "pholiote-du-peuplier|Pholiote du Peuplier", "pied-de-mouton|Pied de Mouton", "pleurote-en-huitre|Pleurote en Huître",
    "russule-charbonniere|Russule Charbonnière", "sparassis-crepu|Sparassis Crépu", "trompette-de-la-mort|Trompette de la Mort"
];

// Function to save markers to LocalStorage
function saveMarkers() {
    let markersData = [];
    userMarkers.eachLayer(marker => {
        markersData.push({
            lat: marker.getLatLng().lat,
            lng: marker.getLatLng().lng,
            mushroom: marker.options.mushroomType
        });
    });
    localStorage.setItem("mushroomMarkers", JSON.stringify(markersData));
}

// Function to load markers from LocalStorage
function loadMarkers() {
    let markersData = JSON.parse(localStorage.getItem("mushroomMarkers"));
    if (markersData) {
        markersData.forEach(data => {
            let marker = L.marker([data.lat, data.lng]).addTo(userMarkers);
            marker.options.mushroomType = data.mushroom;
            marker.bindPopup(`<b>${data.mushroom.replace(/-/g, ' ')}</b><br>Marked location`);
        });
    }
}

// Function to add a marker on long press
map.on('contextmenu', function(event) {
    let selectedMushroom = document.getElementById('mushroomDropdown').value;
    if (!selectedMushroom) {
        alert("Please select a mushroom before adding a marker.");
        return;
    }

    let marker = L.marker(event.latlng, { mushroomType: selectedMushroom }).addTo(userMarkers);
    marker.bindPopup(`<b>${selectedMushroom.replace(/-/g, ' ')}</b><br>Marked location`).openPopup();

    saveMarkers();
});

// Load markers when the map starts
loadMarkers();

// Function to load and merge JSON files for both regions
function loadMushroomData(mushroom) {
    let suisseURL = `cmc/data/suisse-ouest-${mushroom}.json`;
    let franceURL = `cmc/data/rhone-alpes-1-${mushroom}.json`;

    console.log(`Fetching: ${suisseURL} and ${franceURL}`);

    Promise.all([
        fetch(suisseURL).then(res => res.json()).catch(() => null),
        fetch(franceURL).then(res => res.json()).catch(() => null)
    ]).then(([suisseData, franceData]) => {
        if (suisseData && suisseData.data) {
            L.geoJSON(suisseData.data, {
                pointToLayer: function (feature, latlng) {
                    return L.circleMarker(latlng, {
                        radius: 6,
                        fillColor: suisseColor,
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
                        fillColor: franceColor,
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

// Dropdown to select mushrooms
let mushroomSelect = L.control({ position: 'bottomleft' });
mushroomSelect.onAdd = function(map) {
    let div = L.DomUtil.create('div', 'mushroom-select');
    let selectHTML = '<select id="mushroomDropdown"><option value="">Select Mushroom</option>';
    mushrooms.forEach(mushroom => {
        let [value, label] = mushroom.split('|');
        selectHTML += `<option value="${value}">${label}</option>`;
    });
    selectHTML += '</select>';
    div.innerHTML = selectHTML;
    return div;
};
mushroomSelect.addTo(map);
