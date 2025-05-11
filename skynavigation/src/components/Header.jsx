import { useState } from 'react';

function Header({ activeSection, setActiveSection }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const sections = [
    { name: "distance", label: "Get Distance" },
    { name: "traffic", label: "Air Traffic" },
    { name: "weather", label: "Weather Report" },
    { name: "contact", label: "Contact Us" },
  ];

  return (
    <header className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold text-blue-600">SkyNavigation</h1>

        {/* Mobile menu button */}
        <button
          className="lg:hidden text-gray-700"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>

        {/* Desktop menu */}
        <nav className="hidden lg:flex space-x-4">
          {sections.map(({ name, label }) => (
            <button
              key={name}
              onClick={() => setActiveSection(name)}
              className={`px-4 py-2 rounded-md font-semibold ${
                activeSection === name
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-blue-100"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Mobile menu dropdown */}
      {isMenuOpen && (
        <div className="lg:hidden flex flex-col space-y-2 p-4 bg-white shadow-md">
          {sections.map(({ name, label }) => (
            <button
              key={name}
              onClick={() => {
                setActiveSection(name);
                setIsMenuOpen(false); // Close the menu after selection
              }}
              className={`px-4 py-2 rounded-md font-semibold ${
                activeSection === name
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-blue-100"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

export default Header;
