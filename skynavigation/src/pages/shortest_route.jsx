import { useEffect, useState } from "react";
import { findShortestPath, findAlternativePaths } from "../utils/dijkstra";
import { loadAirportData } from "../utils/airportUtils";
import { calculateDistance } from "../utils/airportUtils";

const ShortestRoute = ({ sourceAirport, destinationAirport }) => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [airports, setAirports] = useState([]);

  // Load airport data
  useEffect(() => {
    const fetchAirports = async () => {
      try {
        const data = await loadAirportData();
        setAirports(data);
      } catch (error) {
        console.error('Error loading airport data:', error);
      }
    };

    fetchAirports();
  }, []);

  useEffect(() => {
    const calculateRoutes = async () => {
      if (!sourceAirport || !destinationAirport || airports.length === 0) {
        setRoutes([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Find source and destination indices
        const sourceIndex = airports.findIndex(
          (airport) => airport.name === sourceAirport.name
        );
        const destinationIndex = airports.findIndex(
          (airport) => airport.name === destinationAirport.name
        );

        if (sourceIndex === -1 || destinationIndex === -1) {
          setError("Source or destination airport not found in database");
          setRoutes([]);
          return;
        }

        // Find multiple alternative paths
        const alternativePaths = findAlternativePaths(airports, sourceIndex, destinationIndex, 5);

        if (!alternativePaths || alternativePaths.length === 0) {
          setError("No routes found between airports");
          setRoutes([]);
          return;
        }

        // Calculate details for each route
        const routeDetails = alternativePaths.map((path, index) => {
          const totalDistance = path.distance;

          // Calculate estimated time (assuming average speed of 800 km/h)
          const estimatedTimeHours = totalDistance / 800;
          const hours = Math.floor(estimatedTimeHours);
          const minutes = Math.round((estimatedTimeHours - hours) * 60);

          // Calculate segment distances
          const segments = path.path.map((airport, i) => {
            if (i < path.path.length - 1) {
              const nextAirport = path.path[i + 1];
              const segmentDistance = calculateDistance(
                airport.coords[0],
                airport.coords[1],
                nextAirport.coords[0],
                nextAirport.coords[1]
              );
              return {
                from: airport,
                to: nextAirport,
                distance: segmentDistance
              };
            }
            return null;
          }).filter(Boolean);

          return {
            id: index + 1,
            path: path.path,
            totalDistance: totalDistance,
            timeEstimate: {
              hours,
              minutes
            },
            stops: path.path.length - 2, // Excluding source and destination
            segments
          };
        });

        setRoutes(routeDetails);
      } catch (err) {
        console.error('Error calculating routes:', err);
        setError('Failed to calculate alternative routes');
      } finally {
        setLoading(false);
      }
    };

    calculateRoutes();
  }, [sourceAirport, destinationAirport, airports]);

  return (
    <div className="w-screen mx-auto p-4 bg-gradient-to-r from-blue-50 to-blue-100 shadow-lg rounded-2xl border border-gray-300">
      <h2 className="text-2xl font-extrabold mb-6 text-center text-gray-800">
        🛩️ Alternative Routes
      </h2>

      {loading && <p className="text-center text-gray-600">Calculating routes...</p>}
      {error && <p className="text-center text-red-500 font-medium">{error}</p>}

      {!sourceAirport && !destinationAirport && (
        <div className="p-4 bg-amber-50 text-amber-800 rounded-lg border border-amber-200 text-center mb-4">
          <h3 className="font-medium mb-2">No airports selected</h3>
          <p>Please go to the Distance section first and calculate a route to view alternative paths.</p>
        </div>
      )}

      {routes.length > 0 && (
        <div className="space-y-6">
          {routes.map((route) => (
            <div key={route.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  Route {route.id} {route.id === 1 && "(Shortest)"}
                </h3>
                <div className="flex space-x-4">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Total Distance:</span>{" "}
                    {route.totalDistance.toFixed(1)} km
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Time:</span>{" "}
                    {route.timeEstimate.hours}h {route.timeEstimate.minutes}m
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Stops:</span> {route.stops}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {route.segments.map((segment, index) => (
                  <div key={index} className="flex items-center space-x-2 text-gray-700 bg-gray-50 p-3 rounded">
                    <div className="flex-1">
                      <div className="font-medium">{segment.from.name}</div>
                      <div className="text-sm text-gray-500">{segment.from.city || "Unknown"}</div>
                    </div>
                    <div className="flex flex-col items-center px-4">
                      <div className="text-sm text-gray-500">{segment.distance.toFixed(1)} km</div>
                      <div className="text-gray-400">→</div>
                    </div>
                    <div className="flex-1 text-right">
                      <div className="font-medium">{segment.to.name}</div>
                      <div className="text-sm text-gray-500">{segment.to.city || "Unknown"}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShortestRoute; 