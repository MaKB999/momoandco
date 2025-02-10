let map = L.map('map').setView([46.451, 6.239], 11);
let geojsonLayer;

// Add OpenStreetMap tiles
let tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

document.addEventListener('DOMContentLoaded', function() {
    const radioButtons = document.querySelectorAll('input[type="radio"][name="jsonFile"]');

    // Add event listener to each radio button
    radioButtons.forEach(function(radioButton) {
        radioButton.addEventListener('change', function() {
            if (this.checked) {
                // Load the selected JSON file
                loadJSON(this.value);
            }
        });
    });

    // Load default JSON file
    loadJSON(document.querySelector('input[type="radio"][name="jsonFile"]:checked').value);

    // Check if geolocation is available
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                console.log("Your Location:", lat, lon);

                // Add a marker for the user's location
                let userMarker = L.marker([lat, lon]).addTo(map);
                userMarker.bindPopup("You are here!").openPopup();

                // Center the map on the user's position
                map.setView([lat, lon], 13);
            },
            function(error) {
                console.error("Error getting location:", error);
            }
        );
    } else {
        alert("Geolocation is not supported by your browser.");
    }
});

function loadJSON(file) {
    fetch('data/' + file)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            if (geojsonLayer) {
                geojsonLayer.clearLayers();
            }
            geojsonLayer = L.geoJSON(data.data).addTo(map);
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
        });
}
