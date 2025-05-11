// Function to process airport data
function processAirportData(csvData) {
    console.log('Starting to process airport data...');
    const lines = csvData.split('\n');
    console.log(`Total lines in CSV: ${lines.length}`);
    
    const airports = [];
    let validAirports = 0;
    let invalidAirports = 0;
    
    // Skip header line
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        try {
            // Parse CSV line, handling quoted values
            const values = [];
            let currentValue = '';
            let inQuotes = false;
            
            for (let j = 0; j < line.length; j++) {
                const char = line[j];
                if (char === '"') {
                    inQuotes = !inQuotes;
                } else if (char === ',' && !inQuotes) {
                    values.push(currentValue);
                    currentValue = '';
                } else {
                    currentValue += char;
                }
            }
            values.push(currentValue);
            
            // Extract relevant data
            const [id, name, city, country, iata, icao, lat, lon] = values;
            
            // Only include airports with valid coordinates
            if (lat && lon) {
                const latitude = parseFloat(lat);
                const longitude = parseFloat(lon);
                
                // Validate coordinates
                if (!isNaN(latitude) && !isNaN(longitude) && 
                    latitude >= -90 && latitude <= 90 && 
                    longitude >= -180 && longitude <= 180) {
                    airports.push({
                        name: `${name} (${city}, ${country})`,
                        coords: [latitude, longitude],
                        iata: iata,
                        icao: icao
                    });
                    validAirports++;
                } else {
                    invalidAirports++;
                }
            } else {
                invalidAirports++;
            }
        } catch (error) {
            console.error(`Error processing line ${i}:`, error);
            invalidAirports++;
        }
    }
    
    console.log(`Processing complete:
        - Total lines processed: ${lines.length}
        - Valid airports: ${validAirports}
        - Invalid airports: ${invalidAirports}
        - Final airport count: ${airports.length}`);
    
    return airports;
}

// Function to load and process the CSV file
async function loadAirportData() {
    try {
        console.log('Loading airport data from airports.csv...');
        const response = await fetch('./data/airports.csv');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const csvText = await response.text();
        console.log('CSV data loaded successfully');
        console.log('First 200 characters of CSV:', csvText.substring(0, 200));
        
        const airports = processAirportData(csvText);
        console.log(`Successfully processed ${airports.length} airports`);
        
        if (airports.length === 0) {
            throw new Error('No valid airports found in the data');
        }
        
        window.airports = airports;
        return airports;
    } catch (error) {
        console.error('Error loading airport data:', error);
        // Provide sample data in case of error
        const sampleAirports = [
            {
                name: "Sample Airport 1",
                coords: [40.7128, -74.0060],
                iata: "SAP1"
            },
            {
                name: "Sample Airport 2",
                coords: [34.0522, -118.2437],
                iata: "SAP2"
            }
        ];
        window.airports = sampleAirports;
        return sampleAirports;
    }
}

// Export the function
window.loadAirportData = loadAirportData; 