// components/Map.jsx
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import dangerZone from "../data/DangerZone.js";
import planeIcon from "../assets/plane.png";

function Map({ sourceAirport, destinationAirport, route, setDistance }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const routeLineRef = useRef(null);
  const markersRef = useRef([]);
  const planeMarkerRef = useRef(null);
  const animationFrameRef = useRef(null);

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

    // Add danger zones to map
    dangerZone.forEach((zone) => {
      L.polygon(zone.coords, {
        color: zone.color,
        fillColor: zone.color,
        fillOpacity: 0.5,
        weight: 2,
        opacity: 0.3,
      })
        .addTo(mapInstanceRef.current)
        .bindPopup(`<b>${zone.name}</b><br>Danger Zone`);
    });
  }, []);

  // Draw route when source or destination changes
  useEffect(() => {
    if (!mapInstanceRef.current || !route) return;

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

    const sourceCoords = route.source;
    const destCoords = route.destination;

    // Calculate distance
    const distance =
      mapInstanceRef.current.distance(
        L.latLng(sourceCoords[0], sourceCoords[1]),
        L.latLng(destCoords[0], destCoords[1])
      ) / 1000;

    setDistance(distance);

    // Add source marker
    const sourceMarker = L.marker(sourceCoords)
      .bindPopup(sourceAirport.name)
      .addTo(mapInstanceRef.current);
    sourceMarker.openPopup();
    markersRef.current.push(sourceMarker);

    // Add destination marker
    const destMarker = L.marker(destCoords)
      .bindPopup(destinationAirport.name)
      .addTo(mapInstanceRef.current);
    destMarker.openPopup();
    markersRef.current.push(destMarker);

    // Draw the route line
    routeLineRef.current = L.polyline([sourceCoords, destCoords], {
      color: "blue",
      weight: 3,
      opacity: 0.7,
      dashArray: "10, 10",
    }).addTo(mapInstanceRef.current);

    // Fit map to route bounds
    mapInstanceRef.current.fitBounds(routeLineRef.current.getBounds(), {
      padding: [50, 50],
    });

    // Create plane icon for animation
    const planeIconObj = L.icon({
      iconUrl: planeIcon,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    planeMarkerRef.current = L.marker(sourceCoords, {
      icon: planeIconObj,
    }).addTo(mapInstanceRef.current);

    // Animate plane movement
    let progress = 0;

    function animatePlane() {
      if (progress > 1) return;

      const currentLat =
        sourceCoords[0] + (destCoords[0] - sourceCoords[0]) * progress;
      const currentLng =
        sourceCoords[1] + (destCoords[1] - sourceCoords[1]) * progress;

      planeMarkerRef.current.setLatLng([currentLat, currentLng]);

      progress += 0.002; // Adjust speed here
      animationFrameRef.current = requestAnimationFrame(animatePlane);
    }

    animatePlane();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [route, sourceAirport, destinationAirport, setDistance]);

  return <div ref={mapRef} className="w-full flex-1"></div>;
}

export default Map;
