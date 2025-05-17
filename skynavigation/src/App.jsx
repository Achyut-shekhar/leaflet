import { useEffect, useState } from "react";
import Header from "./components/Header";
import Map from "./components/Map";
import ControlPanel from "./components/ControlPanel";
import AirTrafficMap from "./pages/air_traffic";
import Weather from "./pages/weather";
import Contact from "./pages/Contact"; // ✅ New Import
import ShortestRoute from "./pages/shortest_route";
import "./animations.css";

function App() {
  const [sourceAirport, setSourceAirport] = useState(null);
  const [destinationAirport, setDestinationAirport] = useState(null);
  const [distance, setDistance] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(null);
  const [route, setRoute] = useState(null);
  const [activeSection, setActiveSection] = useState("distance");
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  // Updated to receive an object with all info
  const handleCalculateDistance = ({
    source,
    destination,
    distance,
    time,
    path,
  }) => {
    setSourceAirport(source);
    setDestinationAirport(destination);
    setDistance(distance);
    setEstimatedTime(time);

    if (path && path.length > 0) {
      // Assuming path is array of airports, map to their coordinates for the Map component
      setRoute(path.map((airport) => airport.coords));
    } else {
      setRoute(null);
    }
  };

  useEffect(() => {
    console.log("App - Source Airport updated:", sourceAirport);
    console.log("App - Destination Airport updated:", destinationAirport);
  }, [sourceAirport, destinationAirport]);

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-100">
      {showSplash ? (
        <div className="flex flex-col items-center justify-center h-screen bg-white fade-in">
          <img
            src="logo.png"
            alt="SkyNavigation Logo"
            className="w-24 h-24 mb-4 pulse"
          />
          <h1 className="text-5xl font-extrabold text-blue-700 mb-4 pulse">
            SkyNavigation
          </h1>
          <p className="text-xl text-gray-600 max-w-md text-center px-6 fade-in-up">
            Visualizing Air Routes with Intelligence
          </p>
          <div className="absolute bottom-16 animate-spin text-blue-600 text-3xl">
            <svg
              className="w-12 h-12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z"
              />
            </svg>
          </div>
        </div>
      ) : (
        <>
          <Header
            activeSection={activeSection}
            setActiveSection={handleSectionChange}
          />
          <div className="flex-1 flex flex-col">
            {activeSection === "distance" && (
              <>
                <ControlPanel onCalculate={handleCalculateDistance} />
                <Map
                  sourceAirport={sourceAirport}
                  destinationAirport={destinationAirport}
                  route={route}
                  setDistance={setDistance}
                />
              </>
            )}

            {activeSection === "air_traffic" && (
              <div className="flex-1 overflow-hidden">
                <AirTrafficMap />
              </div>
            )}

            {activeSection === "weather" && (
              <div className="flex-1 overflow-auto">
                <Weather
                  sourceAirport={sourceAirport}
                  destinationAirport={destinationAirport}
                />
              </div>
            )}

            {activeSection === "shortest_route" && (
              <div className="flex-1 overflow-auto">
                <ShortestRoute
                  sourceAirport={sourceAirport}
                  destinationAirport={destinationAirport}
                />
              </div>
            )}

            {activeSection === "contact" && (
              <div className="flex-1 overflow-auto">
                <Contact />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
