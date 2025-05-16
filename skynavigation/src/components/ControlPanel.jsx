import { useState, useEffect } from "react";
import { loadAirportData } from "../utils/airportUtils";
import { findShortestPath } from "../utils/dijkstra";

function ControlPanel({ onCalculateDistance, distance }) {
  const [sourceIndex, setSourceIndex] = useState(0);
  const [destinationIndex, setDestinationIndex] = useState(1);
  const [airportList, setAirportList] = useState([]);
  const [timeToDestination, setTimeToDestination] = useState(null);
  const [path, setPath] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAirports = async () => {
      try {
        setLoading(true);
        const airports = await loadAirportData();
        if (airports.length >= 2) {
          setAirportList(airports);
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

  // Method to calculate the flight time based on the distance
  const calculateTime = (distance) => {
    const averageSpeed = 850; // Average speed in km/h
    const time = distance / averageSpeed; // Time in hours
    return time;
  };

  const handleCalculate = () => {
    if (sourceIndex === destinationIndex) {
      alert("Source and destination cannot be the same.");
      return;
    }

    const source = airportList[sourceIndex];
    const destination = airportList[destinationIndex];
    
    // Find shortest path
    const result = findShortestPath(airportList, sourceIndex, destinationIndex);
    if (result) {
      setPath(result.path);
      onCalculateDistance(source, destination);
    } else {
      alert("No path found between the selected airports.");
    }
  };

  const isDisabled = airportList.length < 2 || loading;

  // Update the time whenever distance is available
  useEffect(() => {
    if (distance) {
      const time = calculateTime(distance);
      setTimeToDestination(time);
    }
  }, [distance]);

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
    <div className="w-screen mx-auto p-1 bg-gradient-to-r from-blue-50 to-blue-100 shadow-lg rounded-2xl border border-gray-300">
      <h2 className="text-2xl font-extrabold mb-6 text-center text-gray-800">
        ✈️ Airport Distance Calculator
      </h2>

      {isDisabled ? (
        <p className="text-center text-red-500 font-medium text-lg">
          Not enough airport data to perform calculation.
        </p>
      ) : (
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

          <div className="md:col-span-3 flex justify-center items-center ">
            <button
              type="button"
              onClick={handleCalculate}
              className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              Calculate Distance
            </button>
          </div>
        </form>
      )}

      {distance && !isDisabled && timeToDestination !== null && (
        <div className="mt-2 p-3 bg-blue-100 border-blue-600 text-blue-900 text-lg rounded-md shadow">
          <p>
            Distance from <strong>{airportList[sourceIndex].name}</strong> to{" "}
            <strong>{airportList[destinationIndex].name}</strong>:{" "}
            <span className="font-bold">{distance.toFixed(2)} km</span>
          </p>
          <p>
            Estimated Time:{" "}
            <span className="font-bold">
              {timeToDestination.toFixed(2)} hours
            </span>
          </p>
          
          {path && path.length > 2 && (
            <div className="mt-2">
              <p className="font-semibold">Route Details:</p>
              <ol className="list-decimal list-inside">
                {path.map((airport, index) => (
                  <li key={index} className="ml-2">
                    {airport.name} ({airport.iata})
                    {index === 0 && " (Source)"}
                    {index === path.length - 1 && " (Destination)"}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ControlPanel;
