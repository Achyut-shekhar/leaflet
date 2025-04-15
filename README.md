✈️ Airport Distance Calculator
A web application that visualizes worldwide airports on an interactive Leaflet map and calculates distances between selected airports. It also highlights no-fly and dangerous zones across the globe such as the Bermuda Triangle and other restricted airspaces.

🚀 Features
🌍 Interactive Leaflet map with zoom and pan functionality.

📍 Displays Indian airports and global airports using OpenFlights dataset.

📏 Calculates great-circle distance between any two selected airports.

⚠️ Shows restricted and dangerous airspaces like:

Bermuda Triangle

Dragon’s Triangle

North Korea No-Fly Zone

Others (expandable list with real coordinates)

🔄 Dynamic marker interactions and polyline drawing.

🛠️ Tech Stack
Frontend: HTML, CSS, JavaScript

Mapping Library: Leaflet.js

Data Sources:

Indian airports dataset (custom)

OpenFlights Airport Data

Custom geo-coordinates for restricted zones

📂 Project Structure
bash
Copy
Edit
project-root/
│
├── index.html              # Main HTML structure
├── style.css               # Basic styling
├── script.js               # Main logic for Leaflet map, marker selection, and distance calculation
├── data/
│   ├── indian_airports.json     # Indian airports with names and coordinates
│   └── global_airports.json     # Global dataset from OpenFlights
✅ How It Works

Select two airports by clicking markers on the map.

The app calculates the distance using the Haversine formula.

Danger zones are shown as polygon/circle overlays to help users avoid restricted areas in flight planning.

📈 Upcoming Features
Filter airports by country or type.

Add flight path optimization with Dijkstra’s algorithm.

UI enhancements and mobile responsiveness.

Backend integration for storing recent searches or flight paths.

🌐 Live Demo
Coming soon or provide GitHub Pages / Netlify link if hosted

📸 Screenshots
(Add screenshots of the working map, selected airports, and distance displayed with danger zones visible.)

🤝 Contributing
Pull requests and feature suggestions are welcome!

📜 License
This project is open source and available under the MIT License.

