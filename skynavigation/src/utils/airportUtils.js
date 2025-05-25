import Papa from 'papaparse';

// Function to load and process airport data from CSV
export async function loadAirportData() {
  try {
    const response = await fetch('/src/data/airports.csv');
    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        complete: (results) => {
          // Transform all airports data
          const airports = results.data
            .map(airport => ({
              name: airport.Name,
              coords: [parseFloat(airport.Latitude), parseFloat(airport.Longitude)],
              city: airport.City,
              country: airport.Country,
              iata: airport.IATA,
              icao: airport.ICAO,
              altitude: parseFloat(airport.Altitude),
              timezone: airport.Timezone
            }))
            .filter(airport => !isNaN(airport.coords[0]) && !isNaN(airport.coords[1])); // Remove any invalid coordinates
          
          resolve(airports);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('Error loading airport data:', error);
    return [];
  }
}

// Function to calculate distance between two points using Haversine formula
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
