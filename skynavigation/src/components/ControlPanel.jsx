import { useState, useEffect } from "react";
import { loadAirportData } from "../utils/airportUtils";
import { findShortestPath } from "../utils/dijkstra";

function ControlPanel({ onCalculate }) {
  const [airportList, setAirportList] = useState([]);
  const [sourceIndex, setSourceIndex] = useState(0);
  const [destinationIndex, setDestinationIndex] = useState(1);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // to store distance/time/path after calculation

  useEffect(() => {
    const fetchAirports = async () => {
      try {
        setLoading(true);
        const airports = await loadAirportData();
        if (airports.length >= 2) {
          setAirportList(airports);
          setError(null);
        } else {
          setError("Not enough airport data available");
        }
      } catch (err) {
        setError("Failed to load airport data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAirports();
  }, []);

  // Calculate distance between two coords using Haversine formula
  const calculateDistance = (coords1, coords2) => {
    const toRad = (value) => (value * Math.PI) / 180;

    const [lat1, lon1] = coords1;
    const [lat2, lon2] = coords2;

    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleCalculateClick = () => {
    if (sourceIndex === destinationIndex) {
      alert("Source and destination cannot be the same.");
      return;
    }

    const source = airportList[sourceIndex];
    const destination = airportList[destinationIndex];

    if (!source || !destination) {
      alert("Invalid airport selection.");
      return;
    }

    // Find shortest path (array of airports) using your dijkstra util
    const pathResult = findShortestPath(airportList, sourceIndex, destinationIndex);
    if (!pathResult) {
      alert("No path found between the selected airports.");
      return;
    }

    const path = pathResult.path;

    // Calculate total distance by summing segments
    let totalDistance = 0;
    for (let i = 0; i < path.length - 1; i++) {
      totalDistance += calculateDistance(path[i].coords, path[i + 1].coords);
    }

    // Calculate estimated time assuming average speed (850 km/h)
    const averageSpeed = 850;
    const estimatedTime = totalDistance / averageSpeed;

    // Store result locally for showing output
    setResult({
      source,
      destination,
      distance: totalDistance.toFixed(2),
      time: estimatedTime.toFixed(2),
      path,
    });

    // Pass all info back to parent if needed
    if (onCalculate) {
      onCalculate({
        source,
        destination,
        distance: totalDistance,
        time: estimatedTime,
        path,
      });
    }
  };

  if (loading) {
    return (
      <div className="w-screen mx-auto p-1 bg-gradient-to-r from-blue-50 to-blue-100 shadow-lg rounded-2xl border border-gray-300">
        <div className="text-center py-4">
          <p className="text-lg text-gray-700">Loading airport data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-screen mx-auto p-1 bg-gradient-to-r from-blue-50 to-blue-100 shadow-lg rounded-2xl border border-gray-300">
        <div className="text-center py-4">
          <p className="text-lg text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-1 bg-gradient-to-r from-blue-50 to-blue-100 shadow-lg rounded-2xl border border-gray-300">

      <h2 className="text-2xl font-extrabold mb-6 text-center text-gray-800">
        ✈️ Airport Distance Calculator
      </h2>

      {/* Show form only if no result */}
      {!result && (
        <form
          onSubmit={(e) => e.preventDefault()}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <label
              htmlFor="source"
              className="block mb-1 font-semibold text-gray-700"
            >
              Source Airport
            </label>
            <select
              id="source"
              value={sourceIndex}
              onChange={(e) => setSourceIndex(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
            >
              {airportList.map((airport, index) => (
                <option key={`source-${index}`} value={index}>
                  {airport.name} ({airport.iata}) - {airport.city}, {airport.country}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="destination"
              className="block mb-1 font-semibold text-gray-700"
            >
              Destination Airport
            </label>
            <select
              id="destination"
              value={destinationIndex}
              onChange={(e) => setDestinationIndex(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
            >
              {airportList.map((airport, index) => (
                <option key={`dest-${index}`} value={index}>
                  {airport.name} ({airport.iata}) - {airport.city}, {airport.country}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 flex justify-center items-center">
            <button
              type="button"
              onClick={handleCalculateClick}
              className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              Calculate Distance
            </button>
          </div>
        </form>
      )}

      {/* Show only distance, time and route after calculation */}
      {result && (
        <div className="mt-6 text-center text-gray-800 font-semibold text-lg space-y-2">
          <p>
            Distance between <strong>{result.source.name}</strong> and{" "}
            <strong>{result.destination.name}</strong>:{" "}
            <span className="text-green-600">{result.distance} km</span>
          </p>
          <p>
            Estimated time (at 850 km/h):{" "}
            <span className="text-green-600">{result.time} hours</span>
          </p>

         <div className="mt-4 max-w-full mx-auto text-gray-700 font-medium text-sm tracking-wide">
  <h3 className="text-lg font-bold text-gray-800 mb-1">Route</h3>
  <span className="text-blue-600 font-semibold">
    Source: {result.path[0].name} ({result.path[0].iata})
  </span>

  {result.path.length > 2 && (
    <>
      {" "}
      <span className="mx-2 text-gray-500">→</span>{" "}
      <span className="italic text-gray-600">
        Stops:{" "}
        {result.path
          .slice(1, result.path.length - 1)
          .map((airport) => `${airport.name} (${airport.iata})`)
          .join(", ")}
      </span>
    </>
  )}

  {" "}
  <span className="mx-2 text-gray-500">→</span>{" "}
  <span className="text-green-600 font-semibold">
    Destination: {result.path[result.path.length - 1].name} (
    {result.path[result.path.length - 1].iata})
  </span>
</div>

        </div>
      )}

    </div>
  );
}

export default ControlPanel;
