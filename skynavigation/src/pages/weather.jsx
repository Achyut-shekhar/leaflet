import { useEffect, useState } from "react";
import axios from "axios";

const Weather = ({ sourceAirport, destinationAirport }) => {
  const [sourceWeather, setSourceWeather] = useState(null);
  const [destinationWeather, setDestinationWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiKey = "4ac7f7d0d27638b77a137c5553a7053c";

  const getWeather = async (lat, lon, setter, airportName) => {
    if (lat == null || lon == null) {
      console.warn(`Missing lat/lon for ${airportName}`);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );

      console.log(`Weather data for ${airportName}:`, res.data);
      setter(res.data);
    } catch (err) {
      console.error(`Error fetching weather for ${airportName}`, err);
      setError(`Failed to fetch weather for ${airportName}`);
      setter(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSourceWeather(null);
    setDestinationWeather(null);
    setError(null);

    if (sourceAirport?.coords) {
      const [lat, lon] = sourceAirport.coords;
      getWeather(lat, lon, setSourceWeather, sourceAirport.name);
    }

    if (destinationAirport?.coords) {
      const [lat, lon] = destinationAirport.coords;
      getWeather(lat, lon, setDestinationWeather, destinationAirport.name);
    }
  }, [sourceAirport, destinationAirport]);

  return (
    <div className="w-screen mx-auto p-4 bg-gradient-to-r from-blue-50 to-blue-100 shadow-lg rounded-2xl border border-gray-300">
      <h2 className="text-2xl font-extrabold mb-6 text-center text-gray-800">
        🌤️ Airport Weather Information
      </h2>

      {loading && <p className="text-center text-gray-600">Loading weather data...</p>}
      {error && <p className="text-center text-red-500 font-medium">{error}</p>}

      {!sourceAirport && !destinationAirport && (
        <div className="p-4 bg-amber-50 text-amber-800 rounded-lg border border-amber-200 text-center mb-4">
          <h3 className="font-medium mb-2">No airports selected</h3>
          <p>Please go to the Distance section first and calculate a route to view weather data.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sourceAirport && (
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              {sourceAirport.name} ({sourceAirport.city || "Unknown"})
            </h3>

            {sourceWeather ? (
              <WeatherDetails weather={sourceWeather} />
            ) : (
              <p className="text-center text-gray-500 my-4">Weather data unavailable</p>
            )}
          </div>
        )}

        {destinationAirport && (
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              {destinationAirport.name} ({destinationAirport.city || "Unknown"})
            </h3>

            {destinationWeather ? (
              <WeatherDetails weather={destinationWeather} />
            ) : (
              <p className="text-center text-gray-500 my-4">Weather data unavailable</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ✅ WeatherDetails component with black text for values
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
