import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// More comprehensive sample data to use when API is rate limited
const SAMPLE_FLIGHTS = [
  // Delhi area
  {
    icao24: "800bc1",
    callsign: "AIC101",
    originCountry: "India",
    latitude: 28.5562,
    longitude: 77.1,
    altitude: 8500,
    velocity: 240,
    trueTrack: 45,
  },
  {
    icao24: "800bc2",
    callsign: "VTI203",
    originCountry: "India",
    latitude: 28.704,
    longitude: 77.1025,
    altitude: 6000,
    velocity: 210,
    trueTrack: 90,
  },
  // Mumbai area
  {
    icao24: "800bc3",
    callsign: "IGO314",
    originCountry: "India",
    latitude: 19.0898,
    longitude: 72.8693,
    altitude: 9500,
    velocity: 260,
    trueTrack: 135,
  },
  {
    icao24: "800bc4",
    callsign: "UAE241",
    originCountry: "United Arab Emirates",
    latitude: 19.2296,
    longitude: 73.12,
    altitude: 12000,
    velocity: 320,
    trueTrack: 270,
  },
  // Bangalore area
  {
    icao24: "800bc5",
    callsign: "AXB505",
    originCountry: "India",
    latitude: 12.9716,
    longitude: 77.5946,
    altitude: 7000,
    velocity: 230,
    trueTrack: 180,
  },
  {
    icao24: "800bc6",
    callsign: "IAF622",
    originCountry: "India",
    latitude: 13.0827,
    longitude: 80.2707,
    altitude: 5000,
    velocity: 200,
    trueTrack: 225,
  },
  // Kolkata area
  {
    icao24: "800bc7",
    callsign: "VTI708",
    originCountry: "India",
    latitude: 22.6515,
    longitude: 88.4467,
    altitude: 10000,
    velocity: 280,
    trueTrack: 315,
  },
  {
    icao24: "800bc8",
    callsign: "AIC839",
    originCountry: "India",
    latitude: 17.4065,
    longitude: 78.4772,
    altitude: 8000,
    velocity: 250,
    trueTrack: 0,
  },
  // International flights
  {
    icao24: "800bc9",
    callsign: "SIA411",
    originCountry: "Singapore",
    latitude: 8.6701,
    longitude: 77.3544,
    altitude: 11000,
    velocity: 300,
    trueTrack: 120,
  },
  {
    icao24: "800bd0",
    callsign: "QTR302",
    originCountry: "Qatar",
    latitude: 25.1052,
    longitude: 69.3173,
    altitude: 13000,
    velocity: 340,
    trueTrack: 60,
  },
  {
    icao24: "800bd1",
    callsign: "BAW159",
    originCountry: "United Kingdom",
    latitude: 27.9944,
    longitude: 73.2028,
    altitude: 12500,
    velocity: 330,
    trueTrack: 105,
  },
  {
    icao24: "800bd2",
    callsign: "THY093",
    originCountry: "Turkey",
    latitude: 32.361,
    longitude: 75.4429,
    altitude: 11500,
    velocity: 310,
    trueTrack: 150,
  },
  // More domestic flights
  {
    icao24: "800bd3",
    callsign: "VTI514",
    originCountry: "India",
    latitude: 15.4909,
    longitude: 73.8278,
    altitude: 4000,
    velocity: 190,
    trueTrack: 210,
  },
  {
    icao24: "800bd4",
    callsign: "IGO625",
    originCountry: "India",
    latitude: 23.1815,
    longitude: 79.9864,
    altitude: 9000,
    velocity: 260,
    trueTrack: 30,
  },
  {
    icao24: "800bd5",
    callsign: "AXB736",
    originCountry: "India",
    latitude: 31.1048,
    longitude: 77.1734,
    altitude: 6500,
    velocity: 220,
    trueTrack: 330,
  },
];

// Optimize sample flights animation
const animateSampleFlights = (prevPlanes) => {
  return prevPlanes.map((plane) => {
    const speedFactor = (0.0001 * plane.velocity) / 100;
    const radians = (plane.trueTrack * Math.PI) / 180;

    const newLat = plane.latitude + Math.cos(radians) * speedFactor;
    const newLon = plane.longitude + Math.sin(radians) * speedFactor;

    // Keep planes within global bounds
    const boundedLat = Math.max(-90, Math.min(90, newLat));
    const boundedLon = Math.max(-180, Math.min(180, newLon));

    return {
      ...plane,
      latitude: boundedLat,
      longitude: boundedLon,
    };
  });
};

function AirTrafficMap() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const animationFrameRef = useRef(null);
  const [airplanes, setAirplanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useSampleData, setUseSampleData] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [nextRetryTime, setNextRetryTime] = useState(null);

  // Initialize sample data
  useEffect(() => {
    if (useSampleData) {
      // Start with initial sample data
      setAirplanes(SAMPLE_FLIGHTS);

      // Set up animation for sample flights
      const animatePlanes = () => {
        setAirplanes((prevPlanes) => animateSampleFlights(prevPlanes));
        animationFrameRef.current = requestAnimationFrame(animatePlanes);
      };

      animationFrameRef.current = requestAnimationFrame(animatePlanes);

      // Cleanup animation on unmount or when switching to real data
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, [useSampleData]);

  // Optimize marker creation with memoization
  const createPlaneIcon = useCallback((rotation, altitude) => {
    let color = "#3b82f6"; // Blue for high altitude
    if (altitude < 5000) {
      color = "#ef4444"; // Red for low altitude
    } else if (altitude < 10000) {
      color = "#f59e0b"; // Amber for medium altitude
    }

    return L.divIcon({
      html: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" 
             style="transform: rotate(${rotation}deg);">
          <path fill="${color}" d="M22,16v-2l-8.5-5V3.5C13.5,2.67,12.83,2,12,2s-1.5,0.67-1.5,1.5V9L2,14v2l8.5-2.5V19L8,20.5V22l4-1l4,1v-1.5
          L13.5,19v-5.5L22,16z"/>
        </svg>
      `,
      className: "plane-icon",
      iconSize: [24, 24], // Reduced size
      iconAnchor: [12, 12],
    });
  }, []);

  // Calculate exponential backoff time for API retries
  const calculateBackoffTime = (retryAttempt) => {
    // Base delay is 1 minute (60000ms)
    // Max delay is 30 minutes
    const baseDelay = 60000;
    const maxDelay = 30 * 60000;

    // Calculate exponential backoff with jitter
    const expBackoff = Math.min(
      maxDelay,
      baseDelay * Math.pow(2, retryAttempt) + Math.random() * 10000
    );

    return Math.round(expBackoff);
  };

  // Optimize data fetching
  const fetchAirTraffic = useCallback(async () => {
    if (useSampleData) return;

    setLoading(true);
    try {
      const bounds = {
        south: -90.0,
        west: -180.0,
        north: 90.0,
        east: 180.0,
      };

      const url = `https://opensky-network.org/api/states/all?lamin=${bounds.south}&lamax=${bounds.north}&lomin=${bounds.west}&lomax=${bounds.east}`;
      
      const response = await fetch(url);
      
      if (response.status === 429) {
        throw new Error("Rate limited by OpenSky API");
      }

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.states && Array.isArray(data.states)) {
        // Optimize data processing
        const planes = data.states
          .filter((plane) => plane[5] && plane[6])
          .map((plane) => ({
            icao24: plane[0],
            callsign: plane[1]?.trim() || "N/A",
            originCountry: plane[2] || "Unknown",
            longitude: plane[5],
            latitude: plane[6],
            altitude: plane[7] || 0,
            velocity: plane[9] || 0,
            trueTrack: plane[10] || 0,
          }))
          .slice(0, 1000); // Limit to 1000 planes for better performance

        if (planes.length > 0) {
          setAirplanes(planes);
          setError(null);
          setRetryCount(0);
          setNextRetryTime(null);
        } else {
          setError("No flight data available from API. Using sample data.");
          setUseSampleData(true);
        }
      } else {
        throw new Error("Invalid API response format");
      }

      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching air traffic data:", error);
      handleFetchError(error);
    } finally {
      setLoading(false);
    }
  }, [useSampleData]);

  // Optimize marker updates
  useEffect(() => {
    if (!mapInstanceRef.current || !airplanes.length) return;

    const map = mapInstanceRef.current;
    const currentMarkers = { ...markersRef.current };
    const currentIcaos = new Set(airplanes.map((plane) => plane.icao24));

    // Batch marker updates
    const updateBatch = [];
    const removeBatch = [];

    // Process updates in batches
    airplanes.forEach((plane) => {
      const { icao24, latitude, longitude, trueTrack, altitude } = plane;

      if (currentMarkers[icao24]) {
        updateBatch.push(() => {
          currentMarkers[icao24].setLatLng([latitude, longitude]);
          currentMarkers[icao24].setIcon(createPlaneIcon(trueTrack, altitude));
        });
      } else {
        const marker = L.marker([latitude, longitude], {
          icon: createPlaneIcon(trueTrack, altitude),
          zIndexOffset: 1000
        }).addTo(map);

        // Simplified popup content
        marker.bindPopup(`
          <div>
            <strong>${plane.callsign}</strong><br>
            ${plane.originCountry}<br>
            Alt: ${Math.round(plane.altitude)}m<br>
            Speed: ${Math.round(plane.velocity)}m/s
          </div>
        `);

        currentMarkers[icao24] = marker;
      }
    });

    // Process removals
    Object.keys(currentMarkers).forEach((icao) => {
      if (!currentIcaos.has(icao)) {
        removeBatch.push(() => {
          map.removeLayer(currentMarkers[icao]);
          delete currentMarkers[icao];
        });
      }
    });

    // Execute updates in batches
    requestAnimationFrame(() => {
      updateBatch.forEach(update => update());
      removeBatch.forEach(remove => remove());
      markersRef.current = currentMarkers;
    });

  }, [airplanes, createPlaneIcon]);

  // Optimize map initialization
  useEffect(() => {
    const map = L.map(mapRef.current, {
      maxZoom: 8, // Limit maximum zoom
      minZoom: 2,
      zoomControl: false, // Disable default zoom control
    }).setView([0, 0], 2);

    // Add optimized tile layer
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 8,
    }).addTo(map);

    // Add zoom control in a specific position
    L.control.zoom({
      position: 'bottomright'
    }).addTo(map);

    mapInstanceRef.current = map;
    fetchAirTraffic();

    const intervalId = setInterval(() => {
      if (!useSampleData && !nextRetryTime) {
        fetchAirTraffic();
      }
    }, 300000); // Increased to 5 minutes to reduce API calls

    return () => {
      clearInterval(intervalId);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      map.remove();
    };
  }, []);

  // Toggle data source (sample vs. real API data)
  const toggleDataSource = () => {
    // If switching from sample to real data
    if (useSampleData) {
      // Cancel any animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      // Check if we're still in backoff period
      if (nextRetryTime && nextRetryTime > new Date()) {
        alert(
          `API is rate limited. Next retry scheduled at ${nextRetryTime.toLocaleTimeString()}`
        );
        return;
      }

      // Try to fetch real data
      setUseSampleData(false);
      fetchAirTraffic();
    } else {
      // Switching to sample data
      setUseSampleData(true);
    }
  };

  // Format timestamp for display
  const formatLastUpdated = () => {
    if (!lastUpdated) return "Never";
    return lastUpdated.toLocaleTimeString();
  };

  return (
    <div className="flex flex-col space-y-4 bg-blue-500">
      <h2 className="text-center font-bold text-2xl">
        Live Air Traffic Map - Global
      </h2>

      {/* Map container */}
      <div
        ref={mapRef}
        className="w-full h-96 md:h-128 rounded-lg shadow-lg border border-gray-300"
      />

      {/* Status bar */}
      <div className="flex flex-col md:flex-row justify-between items-center p-3  bg-blue-500 rounded-md">
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            {loading ? (
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse mr-2"></div>
                <span className="font-medium">Loading data...</span>
              </div>
            ) : (
              <div className="flex items-center">
                <div
                  className={`w-3 h-3 rounded-full mr-2 ${
                    useSampleData ? "bg-amber-500" : "bg-green-500"
                  }`}
                ></div>
                <span className="font-medium">
                  {useSampleData ? "Using sample data" : "Using live data"}
                </span>
              </div>
            )}
          </div>

          <div className="text-sm mt-1">
            <span className="font-medium">Aircraft:</span> {airplanes.length} |
            <span className="font-medium ml-2">Last updated:</span>{" "}
            {formatLastUpdated()}
          </div>

          {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
        </div>

        <div className="flex space-x-3 mt-3 md:mt-0">
          <button
            onClick={fetchAirTraffic}
            disabled={loading || useSampleData}
            className={`px-3 py-1.5 rounded text-white ${
              loading || useSampleData
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            Refresh Data
          </button>

          <button
            onClick={toggleDataSource}
            className={`px-3 py-1.5 rounded text-white ${
              useSampleData
                ? "bg-green-500 hover:bg-green-600"
                : "bg-amber-500 hover:bg-amber-600"
            }`}
          >
            {useSampleData ? "Try Live Data" : "Use Sample Data"}
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 bg-blue-100 rounded-md shadow-sm text-sm text-blue-900">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
          <span>Low Altitude (&lt;5000m)</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-amber-500 rounded-full mr-2"></div>
          <span>Medium Altitude (5000-10000m)</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
          <span>High Altitude (&gt;10000m)</span>
        </div>
      </div>

      {/* Information box */}
      <div className="p-3 bg-blue-50 rounded-md text-sm border border-blue-200 text-blue-900">
        <p>
          <strong>Note:</strong> The OpenSky Network API has strict rate limits
          for free accounts. If you see "Too many requests" errors, the app will
          automatically switch to sample data and try again later. For unlimited
          access, consider using an OpenSky Network account.
        </p>
      </div>
    </div>
  );
}

export default AirTrafficMap;
