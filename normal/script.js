// Initialize Leaflet map
const map = L.map("map", {
    maxBounds: [
        [-90, -180],
        [90, 180],
    ],
    maxBoundsViscosity: 1.0,
});

// Add MapTiler tile layer
L.tileLayer(
    "https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=i1EKELmUt1WLjs1L2QtK",
    {
        attribution:
            '&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        tileSize: 512,
        zoomOffset: -1,
    }
).addTo(map);

const airportMarkers = [];
let routeLine;
let graph;
let planeMarker;
let animationFrame;

// Populate source and destination dropdowns
const sourceSelect = document.getElementById("source");
const destinationSelect = document.getElementById("destination");

// Function to populate dropdowns with airports
function populateAirportDropdowns() {
    if (!window.airports || window.airports.length === 0) {
        console.error('No airports data available');
        return;
    }

    // Clear existing options
    sourceSelect.innerHTML = '';
    destinationSelect.innerHTML = '';

    // Add airports to dropdowns
    window.airports.forEach((airport, index) => {
        const option = new Option(airport.name, index);
        sourceSelect.appendChild(option.cloneNode(true));
        destinationSelect.appendChild(option.cloneNode(true));
    });

    // Set default selections
    if (window.airports.length > 1) {
        destinationSelect.selectedIndex = 1;
    }
}

// Function to add airport markers to the map
function addAirportMarkers() {
    if (!window.airports || window.airports.length === 0) {
        console.error('No airports data available for markers');
        return;
    }

    // Clear existing markers
    airportMarkers.forEach(marker => map.removeLayer(marker));
    airportMarkers.length = 0;
}

// Function to clear route
function clearRoute() {
    if (routeLine) map.removeLayer(routeLine);
    if (planeMarker) map.removeLayer(planeMarker);
    if (animationFrame) cancelAnimationFrame(animationFrame);
    // Clear all markers
    airportMarkers.forEach(marker => map.removeLayer(marker));
    airportMarkers.length = 0;
}

// Function to draw route
function drawRoute(pathCoords, sourceIndex, destinationIndex, pathIndices) {
    // Draw the route line
    routeLine = L.polyline(pathCoords, {
        color: 'blue',
        weight: 3,
        opacity: 0.7,
        dashArray: '10, 10'
    }).addTo(map);

    // Add markers for all airports in the path
    pathIndices.forEach((index, i) => {
        const airport = window.airports[index];
        const isSource = index === sourceIndex;
        const isDestination = index === destinationIndex;
        
        // Create a custom icon with number
        const icon = L.divIcon({
            className: 'path-marker',
            html: `<div style="background-color: ${isSource ? 'green' : isDestination ? 'red' : 'blue'}; 
                             color: white; 
                             padding: 2px 5px; 
                             border-radius: 3px;
                             font-weight: bold;">${i + 1}</div>`
        });

        // Add marker with popup
        const marker = L.marker(airport.coords, { icon: icon })
            .bindPopup(`${isSource ? 'Source' : isDestination ? 'Destination' : 'Stop ' + (i + 1)}: ${airport.name}`)
            .addTo(map);
        
        airportMarkers.push(marker);
    });

    // Create and place a plane icon
    const planeIcon = L.icon({
        iconUrl: "./plane.png",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
    });

    planeMarker = L.marker(pathCoords[0], { icon: planeIcon }).addTo(map);

    let currentSegment = 0;
    let progress = 0;

    function animatePlane() {
        if (currentSegment >= pathCoords.length - 1) return;

        const start = pathCoords[currentSegment];
        const end = pathCoords[currentSegment + 1];

        const currentLat = start[0] + (end[0] - start[0]) * progress;
        const currentLng = start[1] + (end[1] - start[1]) * progress;

        planeMarker.setLatLng([currentLat, currentLng]);

        progress += 0.002; // Adjust speed here

        if (progress >= 1) {
            progress = 0;
            currentSegment++;
        }

        animationFrame = requestAnimationFrame(animatePlane);
    }

    animatePlane();

    // Fit map to show the entire route
    map.fitBounds(routeLine.getBounds(), { padding: [50, 50] });
}

// Function to calculate distance
async function calculateDistance() {
    if (!window.airports || window.airports.length === 0) {
        alert('Airport data not available. Please refresh the page.');
        return;
    }

    const sourceIndex = parseInt(document.getElementById("source").value);
    const destinationIndex = parseInt(document.getElementById("destination").value);

    // Clear existing route
    clearRoute();

    if (sourceIndex !== destinationIndex) {
        const sourceAirport = window.airports[sourceIndex];
        const destinationAirport = window.airports[destinationIndex];

        // Find shortest path using Dijkstra's algorithm
        const result = await graph.dijkstra(sourceIndex, destinationIndex);

        if (result.path.length === 0) {
            alert("No safe path found between the selected airports!");
            return;
        }

        const resultDiv = document.getElementById("result");
        resultDiv.textContent = `Shortest safe distance from ${sourceAirport.name} to ${
            destinationAirport.name
        }: ${result.distance.toFixed(2)} km`;
        resultDiv.style.display = "block";

        // Draw route through all airports in the path
        const pathCoords = result.path.map(index => window.airports[index].coords);
        drawRoute(pathCoords, sourceIndex, destinationIndex, result.path);
    } else {
        alert("Source and destination cannot be the same.");
    }
}

// Load airport data and initialize the application
async function initializeApp() {
    try {
        console.log('Starting application initialization...');
        await loadAirportData();
        console.log('Airport data loaded, populating dropdowns...');
        populateAirportDropdowns();
        console.log('Adding airport markers...');
        addAirportMarkers();
        map.setView([22.9734, 78.6569], 5); // Center on India
        loadDangerZones();

        // Initialize graph
        graph = new Graph();
        graph.buildGraph(window.airports, dangerZone);
        console.log('Application initialization complete');
    } catch (error) {
        console.error('Error initializing application:', error);
    }
}

// Start the application
initializeApp();

document
    .getElementById("calculateDistance")
    .addEventListener("click", function () {
        calculateDistance();
    });

function loadDangerZones() {
    dangerZone.forEach((zone) => {
        L.polygon(zone.coords, {
            color: zone.color,
            fillColor: zone.color,
            fillOpacity: 0.5,
            weight: 2,
            opacity: 0.3,
        })
            .addTo(map)
            .bindPopup(`<b>${zone.name}</b><br>Danger Zone`);
    });
}
