import React from "react";

const Header = ({ activeSection, setActiveSection }) => {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">SkyNavigation</h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setActiveSection("distance")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeSection === "distance"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Distance
            </button>
            <button
              onClick={() => setActiveSection("weather")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeSection === "weather"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Weather
            </button>
            <button
              onClick={() => setActiveSection("shortest_route")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeSection === "shortest_route"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Shortest Route
            </button>
            <button
              onClick={() => setActiveSection("air_traffic")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeSection === "air_traffic"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Air Traffic
            </button>
            <button
              onClick={() => setActiveSection("contact")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeSection === "contact"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Contact
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
