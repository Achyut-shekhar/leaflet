import { useState } from "react";
import Header from "./components/Header"; // ⬅️ Import the new Header
import Map from "./components/Map";
import ControlPanel from "./components/ControlPanel";

function App() {
  const [sourceAirport, setSourceAirport] = useState(null);
  const [destinationAirport, setDestinationAirport] = useState(null);
  const [distance, setDistance] = useState(null);
  const [route, setRoute] = useState(null);

  const [activeSection, setActiveSection] = useState("distance"); // ⬅️ New state for header sections

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
      <Header
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />{" "}
      {/* ⬅️ Header added */}
      {/* Now conditionally show the section */}
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
            {/* Placeholder for Air Traffic */}
            Air Traffic Visualization (Coming soon...)
          </div>
        )}

        {activeSection === "weather" && (
          <div className="flex-1 flex items-center justify-center text-2xl font-semibold text-gray-600">
            {/* Placeholder for Weather Report */}
            Weather Report along Route (Coming soon...)
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
