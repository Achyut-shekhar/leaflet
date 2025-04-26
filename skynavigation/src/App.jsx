import { useState } from "react";
import Map from "./components/Map";
import ControlPanel from "./components/ControlPanel";

function App() {
  const [sourceAirport, setSourceAirport] = useState(null);
  const [destinationAirport, setDestinationAirport] = useState(null);
  const [distance, setDistance] = useState(null);
  const [route, setRoute] = useState(null);

  const handleCalculateDistance = (source, destination) => {
    setSourceAirport(source);
    setDestinationAirport(destination);

    if (source && destination) {
      // Distance calculation will be done in the Map component
      setRoute({
        source: source.coords,
        destination: destination.coords,
      });
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-100">
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
    </div>
  );
}

export default App;
