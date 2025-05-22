// components/Map.jsx
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import dangerZone from "../data/DangerZone.js";
import planeIcon from "../assets/plane.png";
import { findShortestPath, findAlternativePaths } from "../utils/dijkstra";
import { loadAirportData } from "../utils/airportUtils";

/**
 * Map Component
 * Renders an interactive map showing flight routes between airports
 * Features:
 * - Displays shortest path and alternative routes
 * - Shows danger zones
 * - Animates plane movement along the route
 * - Custom markers for source, destination, and stops
 * 
 * @param {Object} sourceAirport - Source airport data
 * @param {Object} destinationAirport - Destination airport data
 * @param {Array} route - Array of airports in the route
 * @param {Function} setDistance - Function to update total route distance
 */
function Map({ sourceAirport, destinationAirport, route, setDistance }) {
  // Refs for managing map state and elements
  const mapRef = useRef(null);                    // Reference to map container div
  const mapInstanceRef = useRef(null);            // Reference to Leaflet map instance
  const routeLineRef = useRef(null);              // Reference to main route line
  const markersRef = useRef([]);                  // Array of airport markers
  const planeMarkerRef = useRef(null);            // Reference to animated plane marker
  const animationFrameRef = useRef(null);         // Reference to animation frame
  const airportsRef = useRef([]);                 // Array of all airports data
  const dangerZonesRef = useRef([]);              // Array of danger zone polygons
  const alternativeRoutesRef = useRef([]);        // Array of alternative route lines
  const [allRoutesUnsafe, setAllRoutesUnsafe] = useState(false);
  const [unsafeConditions, setUnsafeConditions] = useState([]);

  // Weather safety thresholds
  const WEATHER_THRESHOLDS = {
    windSpeed: 50, // km/h
    visibility: 5000, // meters
    precipitation: 10, // mm/h
    turbulence: 3, // scale 1-5
    temperature: -20 // Celsius
  };

  // Function to check weather safety
  const checkWeatherSafety = (weatherData) => {
    const unsafe = [];
    
    if (weatherData.windSpeed > WEATHER_THRESHOLDS.windSpeed) {
      unsafe.push(`High winds: ${weatherData.windSpeed} km/h`);
    }
    if (weatherData.visibility < WEATHER_THRESHOLDS.visibility) {
      unsafe.push(`Low visibility: ${weatherData.visibility} meters`);
    }
    if (weatherData.precipitation > WEATHER_THRESHOLDS.precipitation) {
      unsafe.push(`Heavy precipitation: ${weatherData.precipitation} mm/h`);
    }
    if (weatherData.turbulence > WEATHER_THRESHOLDS.turbulence) {
      unsafe.push(`Severe turbulence: Level ${weatherData.turbulence}`);
    }
    if (weatherData.temperature < WEATHER_THRESHOLDS.temperature) {
      unsafe.push(`Extreme cold: ${weatherData.temperature}°C`);
    }
    
    return unsafe;
  };

  /**
   * Custom marker icons for different types of airports
   * Using divIcon for better styling control
   */
  const sourceIcon = L.divIcon({
    className: 'custom-marker source-marker',
    html: '<div style="background-color: #22c55e; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });

  const destinationIcon = L.divIcon({
    className: 'custom-marker destination-marker',
    html: '<div style="background-color: #ef4444; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });

  const stopIcon = L.divIcon({
    className: 'custom-marker stop-marker',
    html: '<div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 8px rgba(0,0,0,0.2);"></div>',
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });

  /**
   * Load airport data on component mount
   * Fetches airport information and stores in airportsRef
   */
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

  /**
   * Initialize the map on component mount
   * Sets up the base map with MapTiler tiles
   * Centers the map on India by default
   */
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

    map.setView([22.9734, 78.6569], 5); // Center on India
    mapInstanceRef.current = map;

    return () => {
      map.remove();
    };
  }, []);

  /**
   * Load and display danger zones on the map
   * Creates polygons for each danger zone with custom styling
   */
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
        pane: 'shadowPane'
      })
        .addTo(mapInstanceRef.current)
        .bindPopup(`<b>${zone.name}</b><br>Danger Zone`);
      
      dangerZonesRef.current.push(dangerZonePolygon);
    });
  }, []);

  /**
   * Main route drawing effect
   * Triggered when source or destination airports change
   * Handles:
   * - Route calculation
   * - Drawing paths
   * - Adding markers
   * - Plane animation
   */
  useEffect(() => {
    if (!mapInstanceRef.current || !sourceAirport || !destinationAirport || airportsRef.current.length === 0) return;

    // Clean up previous elements
    markersRef.current.forEach((marker) =>
      mapInstanceRef.current.removeLayer(marker)
    );
    markersRef.current = [];

    if (routeLineRef.current) {
      mapInstanceRef.current.removeLayer(routeLineRef.current);
    }

    alternativeRoutesRef.current.forEach(route => {
      mapInstanceRef.current.removeLayer(route);
    });
    alternativeRoutesRef.current = [];

    if (planeMarkerRef.current) {
      mapInstanceRef.current.removeLayer(planeMarkerRef.current);
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Find indices of source and destination airports
    const sourceIndex = airportsRef.current.findIndex(
      (airport) => airport.name === sourceAirport.name
    );
    const destinationIndex = airportsRef.current.findIndex(
      (airport) => airport.name === destinationAirport.name
    );

    // Calculate routes
    const shortestPath = findShortestPath(airportsRef.current, sourceIndex, destinationIndex);
    const alternativePaths = findAlternativePaths(airportsRef.current, sourceIndex, destinationIndex, 5);

    if (!shortestPath) {
      console.error("No path found between airports");
      return;
    }

    const { path, distance, intersectsDangerZone, dangerZoneNames } = shortestPath;
    setDistance(distance);

    // Find first safe alternative path
    const safeAlternativePath = alternativePaths.find(path => !path.intersectsDangerZone);
    const pathToUse = intersectsDangerZone && safeAlternativePath ? safeAlternativePath : shortestPath;

    // Draw alternative paths in red
    alternativePaths.forEach((altPath, index) => {
      if (index === 0) return; // Skip the first one as it's the shortest path
      
      const altPathCoords = altPath.path.map(airport => airport.coords);
      const altRouteLine = L.polyline(altPathCoords, {
        color: altPath.intersectsDangerZone ? "red" : "green",
        weight: 2,
        opacity: 0.7,
        dashArray: "5, 5",
        pane: 'overlayPane',
        zIndexOffset: 500
      }).addTo(mapInstanceRef.current)
        .bindPopup(`<b>${altPath.intersectsDangerZone ? '⚠️ Dangerous Route' : '✅ Safe Route'}</b><br>Distance: ${Math.round(altPath.distance)} km`);
      
      alternativeRoutesRef.current.push(altRouteLine);
    });

    // Draw shortest path in blue
    const pathCoords = path.map(airport => airport.coords);
    routeLineRef.current = L.polyline(pathCoords, {
      color: intersectsDangerZone ? "red" : "blue",
      weight: 3,
      opacity: 0.7,
      dashArray: "10, 10",
      pane: 'overlayPane',
      zIndexOffset: 1000
    }).addTo(mapInstanceRef.current)
      .bindPopup(`<b>${intersectsDangerZone ? '⚠️ Dangerous Route' : '✅ Safe Route'}</b><br>Distance: ${Math.round(distance)} km`);

    // Show alert if route intersects with danger zones
    if (intersectsDangerZone) {
      const dangerZoneList = dangerZoneNames.join(", ");
      const safeRoutes = alternativePaths.filter(path => !path.intersectsDangerZone);
      
      if (safeRoutes.length > 0) {
        alert(`⚠️ WARNING: The shortest route passes through the following danger zones:\n${dangerZoneList}\n\n${safeRoutes.length} safer alternative route(s) have been found. The plane will fly along a safe alternative route.`);
      } else {
        alert(`⚠️ WARNING: This route passes through the following danger zones:\n${dangerZoneList}\n\nNo completely safe alternative routes were found. Please exercise extreme caution.`);
      }
    }

    // Add markers for each airport in the path
    pathToUse.path.forEach((airport, index) => {
      const marker = L.marker(airport.coords, {
        icon: index === 0 ? sourceIcon : index === pathToUse.path.length - 1 ? destinationIcon : stopIcon,
        pane: 'markerPane',
        zIndexOffset: 1000
      })
        .bindPopup(
          `${index === 0 ? "Source" : index === pathToUse.path.length - 1 ? "Destination" : "Stop " + index}: ${
            airport.name
          } (${airport.iata})<br>${airport.city}, ${airport.country}`
        )
        .addTo(mapInstanceRef.current);
      
      // Auto-open popups for source and destination
      if (index === 0 || index === pathToUse.path.length - 1) {
        marker.openPopup();
      }
      
      markersRef.current.push(marker);
    });

    // Adjust map view to show all routes
    const allBounds = [
      routeLineRef.current.getBounds(),
      ...alternativeRoutesRef.current.map(route => route.getBounds())
    ];
    mapInstanceRef.current.fitBounds(L.latLngBounds(allBounds), {
      padding: [50, 50],
    });

    // Set up plane animation
    const planeIconObj = L.icon({
      iconUrl: planeIcon,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    // Create and position plane marker
    const planePathCoords = pathToUse.path.map(airport => airport.coords);
    planeMarkerRef.current = L.marker(planePathCoords[0], {
      icon: planeIconObj,
      pane: 'markerPane',
      zIndexOffset: 2000
    }).addTo(mapInstanceRef.current);

    // Animation variables
    let currentSegment = 0;
    let progress = 0;

    /**
     * Animate plane movement along the route
     * Uses linear interpolation between points
     */
    function animatePlane() {
      if (currentSegment >= planePathCoords.length - 1) return;

      const start = planePathCoords[currentSegment];
      const end = planePathCoords[currentSegment + 1];

      // Calculate current position using linear interpolation
      const currentLat = start[0] + (end[0] - start[0]) * progress;
      const currentLng = start[1] + (end[1] - start[1]) * progress;

      planeMarkerRef.current.setLatLng([currentLat, currentLng]);

      progress += 0.002; // Animation speed

      if (progress >= 1) {
        progress = 0;
        currentSegment++;
      }

      animationFrameRef.current = requestAnimationFrame(animatePlane);
    }

    animatePlane();

    // Cleanup animation on unmount
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [sourceAirport, destinationAirport, setDistance]);

  return (
    <div className="relative w-full h-full flex-1">
      <div ref={mapRef} className="w-full h-full"></div>
    </div>
  );
}

export default Map;
