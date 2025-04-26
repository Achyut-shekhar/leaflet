function Header({ activeSection, setActiveSection }) {
  return (
    <header className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold text-blue-600">SkyNavigation</h1>
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveSection("distance")}
            className={`px-4 py-2 rounded-md font-semibold ${
              activeSection === "distance"
                ? "bg-blue-500 text-white"
                : "text-gray-700 hover:bg-blue-100"
            }`}
          >
            Get Distance
          </button>

          <button
            onClick={() => setActiveSection("traffic")}
            className={`px-4 py-2 rounded-md font-semibold ${
              activeSection === "traffic"
                ? "bg-blue-500 text-white"
                : "text-gray-700 hover:bg-blue-100"
            }`}
          >
            Air Traffic
          </button>

          <button
            onClick={() => setActiveSection("weather")}
            className={`px-4 py-2 rounded-md font-semibold ${
              activeSection === "weather"
                ? "bg-blue-500 text-white"
                : "text-gray-700 hover:bg-blue-100"
            }`}
          >
            Weather Report
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;
