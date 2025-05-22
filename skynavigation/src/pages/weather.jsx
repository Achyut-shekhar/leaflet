import { useEffect, useState } from "react";
import axios from "axios";
import { findAlternativePaths } from "../utils/dijkstra";
import { loadAirportData } from "../utils/airportUtils";

const Weather = ({ sourceAirport, destinationAirport, path }) => {
  const [routeWeather, setRouteWeather] = useState([]);
  const [alternativeRoutes, setAlternativeRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [airports, setAirports] = useState([]);
  const [unsafeConditions, setUnsafeConditions] = useState([]);
  const [safePath, setSafePath] = useState(null);
  const [safePathWeather, setSafePathWeather] = useState(null);
  const [allRoutesUnsafe, setAllRoutesUnsafe] = useState(false);

  const apiKey = "4ac7f7d0d27638b77a137c5553a7053c";

  // Weather safety thresholds
  const SAFETY_THRESHOLDS = {
    windSpeed: 50, // km/h
    visibility: 5000, // meters
    precipitation: 7.5, // mm/h
    turbulence: 0.7, // probability
    temperature: {
      min: -40,
      max: 50
    }
  };

  useEffect(() => {
    const loadAirports = async () => {
      const data = await loadAirportData();
      setAirports(data);
    };
    loadAirports();
  }, []);

  const checkWeatherSafety = (weatherData) => {
    const unsafe = [];
    const windSpeedKmh = weatherData.wind.speed * 3.6;

    if (windSpeedKmh > SAFETY_THRESHOLDS.windSpeed) {
      unsafe.push(`High winds: ${windSpeedKmh.toFixed(1)} km/h`);
    }

    if (weatherData.visibility < SAFETY_THRESHOLDS.visibility) {
      unsafe.push(`Low visibility: ${weatherData.visibility}m`);
    }

    if (weatherData.rain && weatherData.rain['1h'] > SAFETY_THRESHOLDS.precipitation) {
      unsafe.push(`Heavy precipitation: ${weatherData.rain['1h']}mm/h`);
    }

    if (weatherData.main.temp < SAFETY_THRESHOLDS.temperature.min || 
        weatherData.main.temp > SAFETY_THRESHOLDS.temperature.max) {
      unsafe.push(`Extreme temperature: ${weatherData.main.temp}°C`);
    }

    return unsafe;
  };

  const getWeather = async (lat, lon, airportName) => {
    if (lat == null || lon == null) {
      console.warn(`Missing lat/lon for ${airportName}`);
      return null;
    }

    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );

      const unsafeConditions = checkWeatherSafety(res.data);
      
      return {
        airportName,
        weather: res.data,
        unsafeConditions,
        isSafe: unsafeConditions.length === 0
      };
    } catch (err) {
      console.error(`Error fetching weather for ${airportName}`, err);
      return null;
    }
  };

  const findSafePath = async (sourceIndex, destinationIndex) => {
    // Try to find a path with safer weather conditions
    const maxAttempts = 10; // Maximum number of attempts to find a safe path
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      const altPath = findAlternativePaths(airports, sourceIndex, destinationIndex, 1)[0];
      if (!altPath) break;

      // Get weather for this path
      const weatherPromises = altPath.path.map(async (airport) => {
        const [lat, lon] = airport.coords;
        return await getWeather(lat, lon, airport.name);
      });

      const weatherResults = await Promise.all(weatherPromises);
      const validWeatherResults = weatherResults.filter(result => result !== null);
      
      // Check if this path is safe
      const hasUnsafeConditions = validWeatherResults.some(stop => stop.unsafeConditions.length > 0);
      
      if (!hasUnsafeConditions) {
        return {
          path: altPath.path,
          distance: altPath.distance,
          weather: validWeatherResults
        };
      }
      
      attempts++;
    }
    
    return null;
  };

  useEffect(() => {
    const fetchRouteWeather = async () => {
      if (!path || path.length === 0 || !sourceAirport || !destinationAirport) {
        setRouteWeather([]);
        setAlternativeRoutes([]);
        setUnsafeConditions([]);
        setAllRoutesUnsafe(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const sourceIndex = airports.findIndex(airport => airport.name === sourceAirport.name);
        const destinationIndex = airports.findIndex(airport => airport.name === destinationAirport.name);

        if (sourceIndex === -1 || destinationIndex === -1) {
          throw new Error("Source or destination airport not found");
        }

        // Get alternative paths - using the same number as shortest route section
        const altPaths = findAlternativePaths(airports, sourceIndex, destinationIndex, 5);
        
        // Filter out the main path from alternatives to ensure no duplicates
        const filteredAltPaths = altPaths.filter(altPath => 
          altPath.path.length !== path.length || 
          !altPath.path.every((airport, i) => airport.name === path[i].name)
        );
        
        setAlternativeRoutes(filteredAltPaths);

        // Include both main path and alternative paths
        const allRoutes = [path, ...filteredAltPaths.map(route => route.path)];
        const weatherPromises = allRoutes.map(async (routePath) => {
          const weatherPromises = routePath.map(async (airport) => {
            const [lat, lon] = airport.coords;
            return await getWeather(lat, lon, airport.name);
          });
          return await Promise.all(weatherPromises);
        });

        const weatherResults = await Promise.all(weatherPromises);
        const validWeatherResults = weatherResults.map(results => 
          results.filter(result => result !== null)
        );

        // Check if all paths are unsafe
        const allPathsUnsafe = validWeatherResults.every(route => 
          route.some(stop => stop.unsafeConditions.length > 0)
        );
        setAllRoutesUnsafe(allPathsUnsafe);

        // Check for unsafe conditions across all routes
        const allUnsafeConditions = validWeatherResults.flatMap(route => 
          route.flatMap(stop => stop.unsafeConditions)
        );
        setUnsafeConditions([...new Set(allUnsafeConditions)]);

        setRouteWeather(validWeatherResults);
      } catch (err) {
        console.error('Error fetching route weather:', err);
        setError('Failed to fetch weather data for the routes');
      } finally {
        setLoading(false);
      }
    };

    fetchRouteWeather();
  }, [path, sourceAirport, destinationAirport, airports]);

  const getWeatherIcon = (condition) => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('clear')) return '☀️';
    if (conditionLower.includes('cloud')) return '☁️';
    if (conditionLower.includes('rain')) return '🌧️';
    if (conditionLower.includes('snow')) return '❄️';
    if (conditionLower.includes('thunder')) return '⛈️';
    if (conditionLower.includes('mist') || conditionLower.includes('fog')) return '🌫️';
    return '🌤️';
  };

  const getSafetyIcon = (isSafe) => {
    return isSafe ? '✅' : '⚠️';
  };

  return (
    <div className="w-screen mx-auto p-4 bg-gradient-to-r from-blue-50 to-blue-100 shadow-lg rounded-2xl border border-gray-300">
      <h2 className="text-2xl font-extrabold mb-6 text-center text-gray-800">
        🌤️ Route Weather Information
      </h2>

      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {error && (
        <div className="p-4 bg-red-50 text-red-800 rounded-lg border border-red-200 text-center mb-4">
          <p className="font-medium">{error}</p>
        </div>
      )}

      {!path && (
        <div className="p-4 bg-amber-50 text-amber-800 rounded-lg border border-amber-200 text-center mb-4">
          <h3 className="font-medium mb-2">No route selected</h3>
          <p>Please go to the Distance section first and calculate a route to view weather data.</p>
        </div>
      )}

      {allRoutesUnsafe && (
        <div className="mb-8 p-6 bg-red-50 rounded-xl border border-red-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-red-800">⚠️ Flight Delay Required</h3>
            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
              ⏰ Weather Delay
            </span>
          </div>
          <div className="space-y-4">
            <p className="text-red-700">
              Due to severe weather conditions affecting all possible routes, we recommend delaying your flight. 
              Current conditions are not safe for takeoff or landing.
            </p>
            <div className="bg-white p-4 rounded-lg border border-red-100">
              <h4 className="font-medium text-red-800 mb-2">⚠️ Current Weather Hazards:</h4>
              <ul className="list-disc list-inside text-red-700">
                {unsafeConditions.map((condition, index) => (
                  <li key={index}>{condition}</li>
                ))}
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg border border-red-100">
              <h4 className="font-medium text-red-800 mb-2">📋 Recommended Actions:</h4>
              <ul className="list-disc list-inside text-red-700">
                <li>Delay your flight for at least 2-3 hours</li>
                <li>Monitor weather updates for improvements</li>
                <li>Contact your airline for rescheduling options</li>
                <li>Check alternative travel arrangements if possible</li>
              </ul>
            </div>
            <p className="text-sm text-red-600 italic">
              Note: Weather conditions are constantly changing. Please check back in a few hours for updated route information.
            </p>
          </div>
        </div>
      )}

      {routeWeather.length > 0 && (
        <div className="space-y-8">
          {routeWeather.map((routeData, routeIndex) => {
            const routeUnsafeConditions = routeData.flatMap(stop => stop.unsafeConditions);
            const isRouteSafe = routeUnsafeConditions.length === 0;
            const isMainRoute = routeIndex === 0;

            return (
              <div key={routeIndex} className={`bg-white p-6 rounded-xl shadow-md border ${
                isRouteSafe ? 'border-green-200' : 'border-red-200'
              }`}>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {isMainRoute ? "Main Route (Shortest Path)" : `Alternative Route ${routeIndex}`}
                    </h3>
                    {isMainRoute && !isRouteSafe && (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                        ⚠️ Consider Alternative Routes
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      isRouteSafe ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {getSafetyIcon(isRouteSafe)} {isRouteSafe ? "Safe" : "Unsafe"}
                    </span>
                  </div>
                </div>

                {isMainRoute && !isRouteSafe && (
                  <div className="mb-4 p-4 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200">
                    <h4 className="font-medium mb-2">⚠️ Main Route Safety Warning</h4>
                    <p>This is the shortest path but has unsafe weather conditions. Consider using one of the alternative routes below.</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {routeData.map((data, index) => (
                    <div key={data.airportName} className={`bg-gradient-to-br ${
                      data.isSafe ? 'from-blue-50 to-white' : 'from-red-50 to-white'
                    } p-4 rounded-lg shadow-sm border ${
                      data.isSafe ? 'border-blue-100' : 'border-red-100'
                    }`}>
                      <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        {index === 0 ? "Source" : index === routeData.length - 1 ? "Destination" : `Stop ${index}`}: {data.airportName}
                      </h4>

                      {data.weather ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Condition:</span>
                            <span className="flex items-center space-x-2">
                              <span className="text-2xl">{getWeatherIcon(data.weather.weather[0].description)}</span>
                              <span className="capitalize text-gray-800">{data.weather.weather[0].description}</span>
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Temperature:</span>
                            <span className="font-bold text-lg text-gray-800">{data.weather.main.temp} °C</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Feels Like:</span>
                            <span className="text-gray-800">{data.weather.main.feels_like} °C</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Humidity:</span>
                            <span className="text-gray-800">{data.weather.main.humidity}%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Wind Speed:</span>
                            <span className="text-gray-800">{(data.weather.wind.speed * 3.6).toFixed(1)} km/h</span>
                          </div>
                          {data.unsafeConditions.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-red-200">
                              <h5 className="text-red-600 font-medium mb-2">⚠️ Unsafe Conditions:</h5>
                              <ul className="list-disc list-inside text-sm text-red-700">
                                {data.unsafeConditions.map((condition, idx) => (
                                  <li key={idx}>{condition}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-center text-gray-500 my-4">Weather data unavailable</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Weather;
