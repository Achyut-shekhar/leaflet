const dangerZone = [
    {
      "name": "Bermuda Triangle",
      "color": "red",
      "coords": [
        [25.7617, -80.1918],
        [18.4655, -66.1057],
        [32.3078, -64.7505]
      ]
    },
    {
      "name": "Dragon's Triangle",
      "color": "darkred",
      "coords": [
        [35.6762, 139.6503],  // Tokyo
        [24.7840, 141.3223],  // Iwo Jima
        [13.4443, 144.7937]   // Guam
      ]      
    },
    {
      "name": "Clear Air Force Station Restricted Airspace",
      "color": "red",
      "coords": [
        [64.9367, -146.6000],
        [64.8000, -146.4000],
        [64.5000, -145.9000],
        [64.2000, -146.2000],
        [64.3000, -146.8000],
        [64.6000, -147.0000],
        [64.8000, -146.8000],
        [64.9000, -146.6000]
      ]
    },
    
    {
      "name": "Michigan Triangle",
      "color": "blue",
      "coords": [
        [44.0, -87.0],
        [44.0, -85.0],
        [42.0, -86.0]
      ]
    },
    {
      "name": "Area 51",
      "color": "black",
      "coords": [
        [37.2, -115.8],
        [37.3, -115.8],
        [37.4, -115.7],
        [37.5, -115.6],
        [37.6, -115.5],
        [37.7, -115.3],
        [37.8, -115.1],
        [37.9, -114.9],
        [38.0, -114.7],
        [38.1, -114.5],
        [38.2, -114.3],
        [38.3, -114.1],
        [38.4, -113.9],
        [38.5, -113.7],
        [38.6, -113.5]
      ]
    },
    
    {
      "name": "Afghanistan",
      "color": "#8B0000",
      "coords": [
        [35.650072, 61.210817],
        [36.527383, 62.230651],
        [37.133031, 62.984662],
        [37.066762, 63.193538],
        [36.785361, 63.982896],
        [36.491597, 64.546479],
        [36.312073, 64.746105],
        [36.074388, 65.588948],
        [35.650072, 66.518607],
        [35.270664, 66.546150],
        [34.650074, 67.784989],
        [34.146552, 69.262522],
        [34.021646, 69.317764],
        [33.574141, 69.687147],
        [33.525685, 70.323594],
        [33.158534, 70.778201],
        [32.610570, 71.115019],
        [31.713310, 71.156773],
        [30.969660, 71.498768],
        [29.923077, 71.613076],
        [29.318572, 71.498768],
        [29.303276, 70.881803],
        [29.838532, 70.262646],
        [30.377562, 69.330146],
        [30.525282, 69.287576],
        [31.111245, 68.926677],
        [31.713310, 68.556932],
        [31.620190, 67.792689],
        [31.901412, 67.683394],
        [32.182920, 67.433464],
        [32.610570, 67.379446],
        [33.276962, 66.518607],
        [33.541393, 66.546150],
        [34.146552, 66.518607],
        [34.650074, 66.546150],
        [35.270664, 66.518607],
        [35.650072, 66.518607],
        [35.650072, 61.210817] // Closing the polygon
      ]
    },
    {
      "name": "Iran Military Zones",
      "color": "red",
      "coords": [
        [39.4, 51.5],  // Start point
        [39.3, 51.7],
        [39.2, 51.8],
        [39.1, 52.0],
        [38.9, 52.1],
        [38.7, 52.3],
        [38.5, 52.4],
        [38.3, 52.6],
        [38.1, 52.7],
        [37.9, 52.8],
        [37.7, 52.9],
        [37.6, 53.0], // Close to the border
        [37.5, 53.2],
        [37.3, 53.4],
        [37.1, 53.5]
      ]
    },
    
    {
      "name": "Himalayan High-Altitude Restricted Zone",
      "color": "#AA00FF",
      "coords": [
        [28.0, 86.3],  // Northwestern corner of Everest region
        [28.4, 87.5],  // Northeastern extent
        [27.6, 88.0],  // Eastern boundary including Kangchenjunga
        [27.1, 87.5],  // Southeastern corner
        [27.0, 86.7],  // Southern boundary
        [27.3, 85.8],  // Southwestern corner
        [27.8, 85.2],  // Western boundary
        [28.1, 85.7]   // Northwestern extent of the zone
      ]
    },
    {
      "name": "Antarctica No-Fly Zone",
      "color": "#00CED1",
      "coords": [
        [-60.0, -60.0],
        [-65.0, -30.0],
        [-70.0, 0.0],
        [-70.0, 30.0],
        [-65.0, 60.0],
        [-65.0, 90.0],
        [-70.0, 120.0],
        [-70.0, 150.0],
        [-65.0, 180.0],
        [-70.0, -150.0],
        [-70.0, -120.0],
        [-65.0, -90.0]
      ]
    },
    {
      "name": "Syria No-Fly Zones",
      "color": "orange",
      "coords": [
        [37.3, 35.8],  // Northern border with Turkey
        [37.1, 36.7],  // Northern border with Turkey
        [37.0, 38.5],  // Northern border with Turkey
        [36.8, 39.8],  // Northeastern border with Turkey
        [36.5, 41.0],  // Eastern border with Iraq
        [35.0, 40.5],  // Eastern portion near Iraq border
        [34.0, 40.7],  // Eastern portion near Iraq border
        [33.3, 39.0],  // Southeastern border with Jordan
        [32.5, 37.5],  // Southern border with Jordan
        [32.7, 36.0],  // Southwestern border with Israel/Golan Heights
        [33.5, 35.5],  // Western border with Lebanon
        [34.7, 35.8],  // Western border with Mediterranean Sea
        [35.8, 35.7],  // Northwestern coastal region
        [36.3, 35.8]   // Northern return toward Turkish border
      ]
    },
    {
      "name": "North Korea No-Fly Zone",
      "color": "darkgreen",
      "coords": [
        [43.0, 130.7],  // Northeastern border with Russia
        [42.5, 130.2],  // Northern border with China
        [42.1, 129.7],  // Northern border with China
        [41.5, 128.3],  // Northern border with China
        [42.0, 127.3],  // Northern border with China
        [42.4, 126.8],  // Northern border with China
        [42.1, 126.0],  // Northern border with China
        [41.5, 125.3],  // Northwestern border with China
        [40.1, 124.4],  // Western coast
        [39.7, 124.3],  // Western coast
        [38.7, 124.7],  // Western coast
        [38.3, 124.9],  // Western coast near DMZ
        [38.0, 126.0],  // South at DMZ
        [38.1, 127.0],  // South at DMZ
        [38.3, 128.0],  // South at DMZ
        [38.6, 128.4],  // Eastern coast
        [39.8, 127.5],  // Eastern coast
        [40.7, 129.7],  // Eastern coast
        [41.8, 130.0]   // Eastern coast
      ]
    },
    {
      "name": "North Caucasus No-Fly Zone",
      "color": "brown",
      "coords": [
        [44.0, 40.0],  // Northwestern corner near Krasnodar
        [44.2, 42.0],  // Northern boundary
        [43.8, 43.5],  // Northern boundary near Pyatigorsk
        [43.5, 45.0],  // Northern boundary near Grozny
        [43.3, 46.5],  // Northeastern corner near Dagestan
        [42.7, 47.5],  // Eastern boundary near Caspian Sea
        [41.9, 48.0],  // Southeastern boundary (Azerbaijan border)
        [41.3, 47.5],  // Southern boundary along Azerbaijan border
        [41.8, 46.0],  // Southern boundary near Georgia
        [42.5, 44.0],  // Southern boundary through Georgia border
        [43.0, 42.5],  // Southwestern boundary near Sochi
        [43.5, 40.5]   // Western boundary returning to start
      ]
    },
    {
      "name": "Saudi Arabia Military Restricted Airspace",
      "color": "gold",
      "coords": [
        [25.0, 38.7],  // Northwestern corner near Tabuk military region
        [25.2, 40.0],  // Northern boundary
        [24.5, 41.5],  // Northeastern corner near Hail
        [23.8, 41.8],  // Eastern extent near military installations
        [22.7, 41.2],  // Southeastern boundary
        [22.0, 40.5],  // Southern boundary near military zones
        [22.3, 39.0],  // Southwestern region near Yanbu
        [23.0, 38.5],  // Western boundary near Red Sea
        [24.5, 38.0]   // Western boundary returning north
      ]
    },
    {
      "name": "Hawaii (Training Areas)",
      "color": "black",
      "coords": [
        [20.7, -156.7],  // Near the Big Island, southwest
        [20.7, -156.1],  // Near the Big Island, west
        [19.9, -156.1],  // Near the Big Island, northwest
        [19.7, -156.4],  // West of the Big Island
        [19.6, -156.9],  // West of the Big Island
        [19.4, -157.2],  // Off the coast, west of Hawaii
        [19.2, -157.5],  // Off the coast, near Kauai
        [20.0, -157.5],  // Off the coast, north of Oahu
        [20.3, -157.2],  // North of Oahu, near military zones
        [20.5, -157.0],  // Northwest of Oahu
        [21.0, -156.5],  // North of Oahu
        [21.2, -156.0],  // Near the coast of Oahu
        [21.3, -155.7],  // Northeast of Maui
        [21.4, -155.2],  // Northeast of Maui
        [21.6, -154.7],  // Near Maui's north coast
        [21.7, -154.5]   // Near Maui's central north coast
      ]
    },
    
    {
      "name": "South Sudan Conflict No-Fly Zones",
      "color": "darkviolet",
      "coords": [
        [10.0, 29.8],  // Northwestern region near Sudan border
        [9.5, 31.0],   // Northern conflict zone
        [9.8, 32.5],   // Northeastern region near Sudan border
        [8.5, 33.5],   // Eastern region near Ethiopian border
        [7.0, 33.8],   // Eastern conflict zone
        [5.5, 32.5],   // Southeastern region (major conflict area)
        [4.8, 31.5],   // Southern conflict zone
        [3.5, 30.8],   // Southern region near Uganda/DRC borders
        [4.0, 29.5],   // Southwestern region
        [5.0, 28.5],   // Western region near CAR border
        [7.5, 28.0],   // Northwestern return near CAR/Sudan borders
        [9.0, 29.0]    // Northern return to starting point
      ]
    }
  ];

  window.dangerZone = dangerZone;
  
