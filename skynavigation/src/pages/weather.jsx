import { useEffect, useState } from "react";
import axios from "axios";
import { findShortestPath } from "../utils/dijkstra";
import { loadAirportData } from "../utils/airportUtils";

const Weather = ({ sourceAirport, destinationAirport }) => {
  const [routeWeather, setRouteWeather] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [airports, setAirports] = useState([]);

  const apiKey = "4ac7f7d0d27638b77a137c5553a7053c";

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

  const getWeather = async (lat, lon, airportName) => {
    if (lat == null || lon == null) {
      console.warn(`Missing lat/lon for ${airportName}`);
      return null;
    }

    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );

      return {
        airportName,
        weather: res.data
      };
    } catch (err) {
      console.error(`Error fetching weather for ${airportName}`, err);
      return null;
    }
  };

  useEffect(() => {
    const fetchRouteWeather = async () => {
      if (!sourceAirport || !destinationAirport || airports.length === 0) {
        setRouteWeather([]);
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

        // Find shortest path using Dijkstra's algorithm
        const result = findShortestPath(airports, sourceIndex, destinationIndex);

        if (!result) {
          setError("No route found between airports");
          setRouteWeather([]);
          return;
        }

        const { path } = result;

        // Fetch weather for all airports in the path
        const weatherPromises = path.map(async (airport) => {
          const [lat, lon] = airport.coords;
          return await getWeather(lat, lon, airport.name);
        });

        const weatherResults = await Promise.all(weatherPromises);
        const validWeatherResults = weatherResults.filter(result => result !== null);

        setRouteWeather(validWeatherResults);
      } catch (err) {
        console.error('Error fetching route weather:', err);
        setError('Failed to fetch weather data for the route');
      } finally {
        setLoading(false);
      }
    };

    fetchRouteWeather();
  }, [sourceAirport, destinationAirport, airports]);

  return (
    <div className="w-screen mx-auto p-4 bg-gradient-to-r from-blue-50 to-blue-100 shadow-lg rounded-2xl border border-gray-300">
      <h2 className="text-2xl font-extrabold mb-6 text-center text-gray-800">
        🌤️ Route Weather Information
      </h2>

      {loading && <p className="text-center text-gray-600">Loading weather data...</p>}
      {error && <p className="text-center text-red-500 font-medium">{error}</p>}

      {!sourceAirport && !destinationAirport && (
        <div className="p-4 bg-amber-50 text-amber-800 rounded-lg border border-amber-200 text-center mb-4">
          <h3 className="font-medium mb-2">No airports selected</h3>
          <p>Please go to the Distance section first and calculate a route to view weather data.</p>
        </div>
      )}

      {routeWeather.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routeWeather.map((data, index) => (
            <div key={data.airportName} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {index === 0 ? "Source" : index === routeWeather.length - 1 ? "Destination" : `Stop ${index}`}: {data.airportName}
              </h3>

              {data.weather ? (
                <WeatherDetails weather={data.weather} />
              ) : (
                <p className="text-center text-gray-500 my-4">Weather data unavailable</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// WeatherDetails component with black text for values
const WeatherDetails = ({ weather }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <span className="text-gray-600">Temperature:</span>
      <span className="font-bold text-lg text-black">{weather.main.temp} °C</span>
    </div>
    <div className="flex items-center justify-between">
      <span className="text-gray-600">Feels Like:</span>
      <span className="text-black">{weather.main.feels_like} °C</span>
    </div>
    <div className="flex items-center justify-between">
      <span className="text-gray-600">Condition:</span>
      <span className="capitalize text-black">{weather.weather[0].description}</span>
    </div>
    <div className="flex items-center justify-between">
      <span className="text-gray-600">Humidity:</span>
      <span className="text-black">{weather.main.humidity}%</span>
    </div>
    <div className="flex items-center justify-between">
      <span className="text-gray-600">Wind Speed:</span>
      <span className="text-black">{(weather.wind.speed * 3.6).toFixed(1)} km/h</span>
    </div>
  </div>
);

export default Weather;
