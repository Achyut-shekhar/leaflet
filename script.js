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
  
  // Populate source and destination dropdowns
  const sourceSelect = document.getElementById("source");
  const destinationSelect = document.getElementById("destination");
  
  airports.forEach((airport, index) => {
    const option = new Option(airport.name, index);
    sourceSelect.appendChild(option.cloneNode(true));
    destinationSelect.appendChild(option.cloneNode(true));
  });
  
  destinationSelect.selectedIndex = 1;
  map.setView([22.9734, 78.6569], 5); // India
  loadDangerZones();
  
  document
    .getElementById("calculateDistance")
    .addEventListener("click", function () {
      calculateDistance();
    });
  
  function calculateDistance() {
    const sourceIndex = document.getElementById("source").value;
    const destinationIndex = document.getElementById("destination").value;
  
    airportMarkers.forEach((marker) => map.removeLayer(marker));
    airportMarkers.length = 0;
  
    if (sourceIndex !== destinationIndex) {
      const sourceAirport = airports[sourceIndex];
      const destinationAirport = airports[destinationIndex];
  
      const distance =
        map.distance(
          L.latLng(sourceAirport.coords[0], sourceAirport.coords[1]),
          L.latLng(destinationAirport.coords[0], destinationAirport.coords[1])
        ) / 1000;
  
      const resultDiv = document.getElementById("result");
      resultDiv.textContent = `Distance from ${sourceAirport.name} to ${
        destinationAirport.name
      }: ${distance.toFixed(2)} km`;
      resultDiv.style.display = "block";
  
      const sourceMarker = L.marker(sourceAirport.coords)
        .bindPopup(sourceAirport.name)
        .addTo(map);
      sourceMarker.openPopup();
      airportMarkers.push(sourceMarker);
  
      const destinationMarker = L.marker(destinationAirport.coords)
        .bindPopup(destinationAirport.name)
        .addTo(map);
      destinationMarker.openPopup();
      airportMarkers.push(destinationMarker);
  
      drawRoute(sourceAirport.coords, destinationAirport.coords);
    } else {
      alert("Source and destination cannot be the same.");
    }
  }
  

  let planeMarker;
  let animationFrame;
  
  function drawRoute(sourceCoords, destCoords) {
    if (routeLine) map.removeLayer(routeLine);
    if (planeMarker) map.removeLayer(planeMarker);
    if (animationFrame) cancelAnimationFrame(animationFrame);
  
    // Draw the dashed route line
    routeLine = L.polyline([sourceCoords, destCoords], {
      color: "blue",
      weight: 3,
      opacity: 0.7,
      dashArray: "10, 10",
    }).addTo(map);
  
    map.fitBounds(routeLine.getBounds(), { padding: [50, 50] });
  
    // Create and place a plane icon
    const planeIcon = L.icon({
      iconUrl: "./image/plane-map-pointer-icon_791764-3335-removebg-preview.png",
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  
    planeMarker = L.marker(sourceCoords, { icon: planeIcon }).addTo(map);
  
    let progress = 0;
  
    function animatePlane() {
      if (progress > 1) return;
  
      const currentLat = sourceCoords[0] + (destCoords[0] - sourceCoords[0]) * progress;
      const currentLng = sourceCoords[1] + (destCoords[1] - sourceCoords[1]) * progress;
  
      planeMarker.setLatLng([currentLat, currentLng]);
  
      progress += 0.002; // Adjust speed here
      animationFrame = requestAnimationFrame(animatePlane);
    }
  
    animatePlane();
  }
  

  
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
