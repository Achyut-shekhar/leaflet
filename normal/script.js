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
let exploringLines = [];
let finalPathLine;
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

    // Add markers for all airports
    window.airports.forEach(airport => {
        if (airport.coords && Array.isArray(airport.coords) && airport.coords.length === 2) {
            const marker = L.marker(airport.coords)
                .bindPopup(airport.name)
                .addTo(map);
            airportMarkers.push(marker);
        } else {
            console.warn('Invalid coordinates for airport:', airport);
        }
    });

    console.log(`Added ${airportMarkers.length} airport markers to the map`);
}

// Function to clear all route lines
function clearRouteLines() {
    if (routeLine) map.removeLayer(routeLine);
    if (finalPathLine) map.removeLayer(finalPathLine);
    exploringLines.forEach(line => map.removeLayer(line));
    exploringLines = [];
    if (planeMarker) map.removeLayer(planeMarker);
    if (animationFrame) cancelAnimationFrame(animationFrame);
}

// Function to draw exploring path
function drawExploringPath(fromIndex, toIndex, color = 'gray') {
    console.log('Drawing exploring path:', fromIndex, toIndex, color);
    const fromAirport = window.airports[fromIndex];
    const toAirport = window.airports[toIndex];
    
    if (!fromAirport || !toAirport) {
        console.error('Invalid airport indices:', fromIndex, toIndex);
        return;
    }
    
    const line = L.polyline([fromAirport.coords, toAirport.coords], {
        color: color,
        weight: 3,
        opacity: 0.7,
        dashArray: '10, 10'
    }).addTo(map);
    
    // Add popup to show distance
    const distance = graph.calculateDistance(fromAirport.coords, toAirport.coords);
    line.bindPopup(`Distance: ${distance.toFixed(2)} km`);
    
    exploringLines.push(line);
    
    // Fit map to show the current path
    const bounds = L.latLngBounds([fromAirport.coords, toAirport.coords]);
    map.fitBounds(bounds.pad(0.1));
}

// Function to draw final path
function drawFinalPath(pathIndices) {
    console.log('Drawing final path:', pathIndices);
    const pathCoords = pathIndices.map(index => window.airports[index].coords);
    
    // Draw the final path with a different style
    finalPathLine = L.polyline(pathCoords, {
        color: 'red',
        weight: 4,
        opacity: 0.8,
        dashArray: '15, 15'
    }).addTo(map);
    
    // Add markers for each airport in the path
    pathIndices.forEach((index, i) => {
        const airport = window.airports[index];
        const marker = L.marker(airport.coords, {
            icon: L.divIcon({
                className: 'path-marker',
                html: `<div style="background-color: red; color: white; padding: 2px 5px; border-radius: 3px;">${i + 1}</div>`
            })
        }).addTo(map);
        marker.bindPopup(`Stop ${i + 1}: ${airport.name}`);
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
    
    // Fit map to show the entire path
    const bounds = L.latLngBounds(pathCoords);
    map.fitBounds(bounds.pad(0.1));
}

// Function to calculate distance with visualization
async function calculateDistance() {
    if (!window.airports || window.airports.length === 0) {
        alert('Airport data not available. Please refresh the page.');
        return;
    }

    const sourceIndex = parseInt(document.getElementById("source").value);
    const destinationIndex = parseInt(document.getElementById("destination").value);

    // Clear existing markers and routes
    clearRouteLines();

    if (sourceIndex !== destinationIndex) {
        const sourceAirport = window.airports[sourceIndex];
        const destinationAirport = window.airports[destinationIndex];

        // Show loading message
        const resultDiv = document.getElementById("result");
        resultDiv.textContent = "Calculating route...";
        resultDiv.style.display = "block";

        try {
            // Find shortest path using Dijkstra's algorithm with visualization
            const result = await graph.dijkstraWithVisualization(sourceIndex, destinationIndex, drawExploringPath);
            console.log('Dijkstra result:', result);

            if (result.path.length === 0) {
                resultDiv.textContent = "No safe path found between the selected airports!";
                return;
            }

            resultDiv.textContent = `Shortest safe distance from ${sourceAirport.name} to ${
                destinationAirport.name
            }: ${result.distance.toFixed(2)} km`;

            // Draw the final path
            drawFinalPath(result.path);
        } catch (error) {
            console.error('Error calculating route:', error);
            resultDiv.textContent = "Error calculating route. Please try again.";
        }
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
