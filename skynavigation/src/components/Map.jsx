// components/Map.jsx
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import dangerZone from "../data/DangerZone.js";
import planeIcon from "../assets/plane.png";
import { findShortestPath } from "../utils/dijkstra";
import { loadAirportData } from "../utils/airportUtils";

function Map({ sourceAirport, destinationAirport, route, setDistance }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const routeLineRef = useRef(null);
  const markersRef = useRef([]);
  const planeMarkerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const airportsRef = useRef([]);
  const dangerZonesRef = useRef([]);

  // Load airport data
  useEffect(() => {
    const fetchAirports = async () => {
      try {
        const airports = await loadAirportData();
        airportsRef.current = airports;
      } catch (error) {
        console.error('Error loading airport data:', error);
      }
    };

    fetchAirports();
  }, []);

  // Initialize map
  useEffect(() => {
    const map = L.map(mapRef.current, {
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

    map.setView([22.9734, 78.6569], 5); // India
    mapInstanceRef.current = map;

    return () => {
      map.remove();
    };
  }, []);

  // Load danger zones
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear previous danger zones
    dangerZonesRef.current.forEach(zone => {
      mapInstanceRef.current.removeLayer(zone);
    });
    dangerZonesRef.current = [];

    // Add danger zones to map with lower z-index
    dangerZone.forEach((zone) => {
      const dangerZonePolygon = L.polygon(zone.coords, {
        color: zone.color,
        fillColor: zone.color,
        fillOpacity: 0.5,
        weight: 2,
        opacity: 0.3,
        pane: 'shadowPane' // Use a lower z-index pane
      })
        .addTo(mapInstanceRef.current)
        .bindPopup(`<b>${zone.name}</b><br>Danger Zone`);
      
      dangerZonesRef.current.push(dangerZonePolygon);
    });
  }, []);

  // Draw route when source or destination changes
  useEffect(() => {
    if (!mapInstanceRef.current || !route || airportsRef.current.length === 0) return;

    // Clean up previous markers
    markersRef.current.forEach((marker) =>
      mapInstanceRef.current.removeLayer(marker)
    );
    markersRef.current = [];

    if (routeLineRef.current) {
      mapInstanceRef.current.removeLayer(routeLineRef.current);
    }

    if (planeMarkerRef.current) {
      mapInstanceRef.current.removeLayer(planeMarkerRef.current);
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Find source and destination indices
    const sourceIndex = airportsRef.current.findIndex(
      (airport) => airport.name === sourceAirport.name
    );
    const destinationIndex = airportsRef.current.findIndex(
      (airport) => airport.name === destinationAirport.name
    );

    // Find shortest path using Dijkstra's algorithm
    const result = findShortestPath(airportsRef.current, sourceIndex, destinationIndex);

    if (!result) {
      console.error("No path found between airports");
      return;
    }

    const { path, distance } = result;
    setDistance(distance);

    // Create coordinates array for the path
    const pathCoords = path.map((airport) => airport.coords);

    // Add markers for each airport in the path with higher z-index
    path.forEach((airport, index) => {
      const marker = L.marker(airport.coords, {
        pane: 'markerPane', // Use a higher z-index pane
        zIndexOffset: 1000 // Ensure markers are above other elements
      })
        .bindPopup(
          `${index === 0 ? "Source" : index === path.length - 1 ? "Destination" : "Stop " + index}: ${
            airport.name
          } (${airport.iata})<br>${airport.city}, ${airport.country}`
        )
        .addTo(mapInstanceRef.current);
      
      if (index === 0 || index === path.length - 1) {
        marker.openPopup();
      }
      
      markersRef.current.push(marker);
    });

    // Draw the route line with higher z-index
    routeLineRef.current = L.polyline(pathCoords, {
      color: "blue",
      weight: 3,
      opacity: 0.7,
      dashArray: "10, 10",
      pane: 'overlayPane', // Use a higher z-index pane
      zIndexOffset: 1000 // Ensure route is above other elements
    }).addTo(mapInstanceRef.current);

    // Fit map to route bounds
    mapInstanceRef.current.fitBounds(routeLineRef.current.getBounds(), {
      padding: [50, 50],
    });

    // Create plane icon for animation with higher z-index
    const planeIconObj = L.icon({
      iconUrl: planeIcon,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    planeMarkerRef.current = L.marker(pathCoords[0], {
      icon: planeIconObj,
      pane: 'markerPane', // Use a higher z-index pane
      zIndexOffset: 2000 // Ensure plane is above everything else
    }).addTo(mapInstanceRef.current);

    // Animate plane movement along the path
    let currentSegment = 0;
    let progress = 0;

    function animatePlane() {
      if (currentSegment >= pathCoords.length - 1) return;

      const start = pathCoords[currentSegment];
      const end = pathCoords[currentSegment + 1];

      const currentLat = start[0] + (end[0] - start[0]) * progress;
      const currentLng = start[1] + (end[1] - start[1]) * progress;

      planeMarkerRef.current.setLatLng([currentLat, currentLng]);

      progress += 0.002; // Adjust speed here

      if (progress >= 1) {
        progress = 0;
        currentSegment++;
      }

      animationFrameRef.current = requestAnimationFrame(animatePlane);
    }

    animatePlane();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [route, sourceAirport, destinationAirport, setDistance]);

  return <div ref={mapRef} className="w-full h-full flex-1"></div>;
}

export default Map;
