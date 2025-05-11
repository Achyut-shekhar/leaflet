// pages/Weather.jsx
import { useEffect, useState } from "react";
import axios from "axios";

const Weather = ({ sourceAirport, destinationAirport }) => {
  const [sourceWeather, setSourceWeather] = useState(null);
  const [destinationWeather, setDestinationWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // This API key should ideally be stored in an environment variable
  const apiKey = "4ac7f7d0d27638b77a137c5553a7053c";

  const getWeather = async (airport, setter) => {
    if (!airport?.lat || !airport?.lon) {
      console.warn("Airport is missing latitude or longitude:", airport);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${airport.lat}&lon=${airport.lon}&appid=${apiKey}&units=metric`
      );

      console.log(`Weather data for ${airport.name}:`, res.data);
      setter(res.data);
    } catch (err) {
      console.error("Weather fetch error for", airport.name, err);
      setError(`Failed to fetch weather for ${airport.name}. ${err.message}`);
      setter(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSourceWeather(null);
    setDestinationWeather(null);
    setError(null);

    if (sourceAirport?.lat && sourceAirport?.lon) {
      getWeather(sourceAirport, setSourceWeather);
    }

    if (destinationAirport?.lat && destinationAirport?.lon) {
      getWeather(destinationAirport, setDestinationWeather);
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
              {sourceAirport.name} ({sourceAirport.city}, {sourceAirport.country})
            </h3>

            {sourceWeather ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Temperature:</span>
                  <span className="font-bold text-lg">{sourceWeather.main.temp} °C</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Feels Like:</span>
                  <span>{sourceWeather.main.feels_like} °C</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Condition:</span>
                  <span className="capitalize">{sourceWeather.weather[0].description}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Humidity:</span>
                  <span>{sourceWeather.main.humidity}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Wind Speed:</span>
                  <span>{(sourceWeather.wind.speed * 3.6).toFixed(1)} km/h</span>
                </div>
              </div>
            ) : loading ? (
              <p className="text-center text-gray-500 my-4">Loading weather data...</p>
            ) : (
              <p className="text-center text-gray-500 my-4">Weather data unavailable</p>
            )}
          </div>
        )}

        {destinationAirport && (
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              {destinationAirport.name} ({destinationAirport.city}, {destinationAirport.country})
            </h3>

            {destinationWeather ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Temperature:</span>
                  <span className="font-bold text-lg">{destinationWeather.main.temp} °C</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Feels Like:</span>
                  <span>{destinationWeather.main.feels_like} °C</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Condition:</span>
                  <span className="capitalize">{destinationWeather.weather[0].description}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Humidity:</span>
                  <span>{destinationWeather.main.humidity}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Wind Speed:</span>
                  <span>{(destinationWeather.wind.speed * 3.6).toFixed(1)} km/h</span>
                </div>
              </div>
            ) : loading ? (
              <p className="text-center text-gray-500 my-4">Loading weather data...</p>
            ) : (
              <p className="text-center text-gray-500 my-4">Weather data unavailable</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;
