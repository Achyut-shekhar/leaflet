import { useEffect, useState } from "react";
import Header from "./components/Header";
import Map from "./components/Map";
import ControlPanel from "./components/ControlPanel";
import "./animations.css"; // Import custom animations

function App() {
  const [sourceAirport, setSourceAirport] = useState(null);
  const [destinationAirport, setDestinationAirport] = useState(null);
  const [distance, setDistance] = useState(null);
  const [route, setRoute] = useState(null);
  const [activeSection, setActiveSection] = useState("distance");
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 4000); // Show splash for 4 seconds
    return () => clearTimeout(timer); // Cleanup the timer when the component is unmounted
  }, []);

  const handleCalculateDistance = (source, destination) => {
    setSourceAirport(source);
    setDestinationAirport(destination);
    if (source && destination) {
      setRoute({
        source: source.coords,
        destination: destination.coords,
      });
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-100">
      {showSplash ? (
        <div className="flex flex-col items-center justify-center h-screen bg-white fade-in">
          {/* Logo: You can replace 'logo.png' with the actual path to your logo */}
          <img
            src="logo.png" // Replace with actual logo path
            alt="SkyNavigation Logo"
            className="w-24 h-24 mb-4 pulse"
          />
          <h1 className="text-5xl font-extrabold text-blue-700 mb-4 pulse">
            SkyNavigation
          </h1>
          <p className="text-xl text-gray-600 max-w-md text-center px-6 fade-in-up">
            Visualizing Air Routes with Intelligence
          </p>

          {/* Loading Spinner */}
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
            setActiveSection={setActiveSection}
          />
          <div className="flex-1 flex flex-col">
            {activeSection === "distance" && (
              <>
                <ControlPanel
                  onCalculateDistance={handleCalculateDistance}
                  distance={distance}
                />
                <Map
                  sourceAirport={sourceAirport}
                  destinationAirport={destinationAirport}
                  route={route}
                  setDistance={setDistance}
                />
              </>
            )}
            {activeSection === "traffic" && (
              <div className="flex-1 flex items-center justify-center text-2xl font-semibold text-gray-600">
                Air Traffic Visualization (Coming soon...)
              </div>
            )}
            {activeSection === "weather" && (
              <div className="flex-1 flex items-center justify-center text-2xl font-semibold text-gray-600">
                Weather Report along Route (Coming soon...)
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
