const airports = [
  {
    name: "Indira Gandhi International Airport",
    coords: [28.5562, 77.1],
  },
  {
    name: "Chhatrapati Shivaji Maharaj International Airport",
    coords: [19.0896, 72.8656],
  },
  {
    name: "Kempegowda International Airport",
    coords: [13.1986, 77.7066],
  },
  {
    name: "Netaji Subhas Chandra Bose International Airport",
    coords: [22.6547, 88.4467],
  },
  {
    name: "Chennai International Airport",
    coords: [12.9941, 80.1709],
  },
  {
    name: "Rajiv Gandhi International Airport",
    coords: [17.2403, 78.4294],
  },
  {
    name: "Cochin International Airport",
    coords: [10.152, 76.4019],
  },
  {
    name: "Sardar Vallabhbhai Patel International Airport",
    coords: [23.0722, 72.6311],
  },
  {
    name: "Goa International Airport",
    coords: [15.38, 73.8312],
  },
  {
    name: "Jaipur International Airport",
    coords: [26.8242, 75.8028],
  },
  {
    name: "Lokpriya Gopinath Bordoloi International Airport",
    coords: [26.1061, 91.5859],
  },
  {
    name: "Sri Guru Ram Dass Jee International Airport",
    coords: [31.7096, 74.7973],
  },
  {
    name: "Biju Patnaik International Airport",
    coords: [20.2539, 85.8178],
  },
  {
    name: "Devi Ahilya Bai Holkar Airport",
    coords: [22.7216, 75.801],
  },
  {
    name: "Lal Bahadur Shastri International Airport",
    coords: [25.4524, 82.8593],
  },
  {
    name: "Dr. Babasaheb Ambedkar International Airport",
    coords: [21.0922, 79.0472],
  },
  {
    name: "Veer Savarkar International Airport",
    coords: [11.6411, 92.7297],
  },
  {
    name: "Birsa Munda Airport",
    coords: [23.3142, 85.3219],
  },
  {
    name: "Bagdogra Airport",
    coords: [26.6812, 88.3286],
  },
  {
    name: "Mangalore International Airport",
    coords: [12.9613, 74.8901],
  },
  {
    name: "Madurai Airport",
    coords: [9.8345, 78.0934],
  },
  {
    name: "Trivandrum International Airport",
    coords: [8.4821, 76.9206],
  },
  {
    name: "Pune Airport",
    coords: [18.5826, 73.9197],
  },
  {
    name: "Surat Airport",
    coords: [21.1141, 72.7411],
  },
  {
    name: "Vadodara Airport",
    coords: [22.3362, 73.2263],
  },
  {
    name: "Visakhapatnam Airport",
    coords: [17.7211, 83.2245],
  },
  {
    name: "Patna Airport",
    coords: [25.5913, 85.0882],
  },
  {
    name: "Agartala Airport",
    coords: [23.886, 91.2405],
  },
  {
    name: "Imphal Airport",
    coords: [24.7606, 93.8967],
  },
  {
    name: "Dibrugarh Airport",
    coords: [27.4839, 95.0169],
  },
  {
    name: "Shillong Airport",
    coords: [25.7036, 91.9782],
  },
  {
    name: "Dimapur Airport",
    coords: [25.8839, 93.7714],
  },
  {
    name: "Jammu Airport",
    coords: [32.6891, 74.8379],
  },
  {
    name: "Leh Airport",
    coords: [34.1359, 77.5465],
  },
  {
    name: "Port Blair Airport",
    coords: [11.6411, 92.7297],
  },
  {
    name: "Dehradun Airport",
    coords: [30.1897, 78.1809],
  },
  {
    name: "Kannur International Airport",
    coords: [11.9184, 75.5472],
  },
  {
    name: "Calicut International Airport",
    coords: [11.1368, 75.9553],
  },
  {
    name: "Tiruchirappalli International Airport",
    coords: [10.7653, 78.7097],
  },
  {
    name: "Coimbatore International Airport",
    coords: [11.0314, 77.0434],
  },
  {
    name: "Lucknow Airport",
    coords: [26.7606, 80.8893],
  },
  {
    name: "Chandigarh International Airport",
    coords: [30.6735, 76.7885],
  },
  {
    name: "Gaya Airport",
    coords: [24.7449, 84.9511],
  },
  {
    name: "Raipur Airport",
    coords: [21.1804, 81.7389],
  },
  {
    name: "Vijayawada Airport",
    coords: [16.5304, 80.7967],
  },
  {
    name: "Tirupati Airport",
    coords: [13.6325, 79.5433],
  },
  {
    name: "Udaipur Airport",
    coords: [24.6179, 73.8961],
  },
  {
    name: "Jodhpur Airport",
    coords: [26.2513, 73.0481],
  },
  {
    name: "Rajkot Airport",
    coords: [22.3117, 70.7792],
  },
  {
    name: "Aurangabad Airport",
    coords: [19.8633, 75.3979],
  },
  {
    name: "Shirdi Airport",
    coords: [19.6886, 74.3649],
  },
  {
    name: "Hubli Airport",
    coords: [15.3617, 75.0849],
  },
  {
    name: "Silchar Airport",
    coords: [24.9129, 92.9787],
  },
  {
    name: "Tezpur Airport",
    coords: [26.7091, 92.7847],
  },
  {
    name: "Jorhat Airport",
    coords: [26.7315, 94.1753],
  },
  {
    name: "Lilabari Airport",
    coords: [27.2954, 94.0976],
  },
  {
    name: "Lengpui Airport",
    coords: [23.8435, 92.6196],
  },
  {
    name: "Bhavnagar Airport",
    coords: [21.7519, 72.1852],
  },
  {
    name: "Jamnagar Airport",
    coords: [22.4655, 70.0126],
  },
  {
    name: "Bhuj Airport",
    coords: [23.2874, 69.6705],
  },
  {
    name: "Porbandar Airport",
    coords: [21.6485, 69.6563],
  },
  {
    name: "Kandla Airport",
    coords: [23.1124, 70.1003],
  },
  {
    name: "Diu Airport",
    coords: [20.7131, 70.9211],
  },
  {
    name: "Jabalpur Airport",
    coords: [23.1778, 80.0522],
  },
  {
    name: "Bhopal Airport",
    coords: [23.2875, 77.3482],
  },
  {
    name: "Agra Airport",
    coords: [27.1556, 77.9609],
  },
  {
    name: "Jharsuguda Airport",
    coords: [21.9135, 84.0501],
  },
  {
    name: "Kadapa Airport",
    coords: [14.5128, 78.7728],
  },
  {
    name: "Mysore Airport",
    coords: [12.3072, 76.6497],
  },
  {
    name: "Salem Airport",
    coords: [11.7831, 78.0655],
  },
  {
    name: "Tuticorin Airport",
    coords: [8.7241, 78.0252],
  },
  {
    name: "Belgaum Airport",
    coords: [15.8593, 74.6185],
  },
  {
    name: "Rajahmundry Airport",
    coords: [17.1106, 81.8181],
  },
  {
    name: "Khajuraho Airport",
    coords: [24.8201, 79.9186],
  },
  {
    name: "Tezu Airport",
    coords: [27.9412, 96.1344],
  },
  {
    name: "Daporijo Airport",
    coords: [27.9833, 94.2167],
  },
  {
    name: "Pasighat Airport",
    coords: [28.066, 95.3356],
  },
  {
    name: "Zero Airport",
    coords: [27.5883, 93.8275],
  },
  {
    name: "Rupsi Airport",
    coords: [26.1398, 89.91],
  },
  {
    name: "Zimithang Advanced Landing Ground",
    coords: [27.3953, 91.9578],
  },
  {
    name: "Tuting Advanced Landing Ground",
    coords: [29.0366, 94.8998],
  },
  {
    name: "Walong Advanced Landing Ground",
    coords: [28.1536, 97.2253],
  },
  {
    name: "Mechuka Advanced Landing Ground",
    coords: [28.6233, 94.722],
  },
  {
    name: "Along Airport",
    coords: [28.1747, 94.802],
  },
  {
    name: "Ziro Airport",
    coords: [27.5883, 93.8275],
  },
  {
    name: "Pakyong Airport",
    coords: [27.2306, 88.5856],
  },
  {
    name: "Kishangarh Airport",
    coords: [26.5975, 74.8134],
  },
  {
    name: "Pathankot Airport",
    coords: [32.2336, 75.6344],
  },
  {
    name: "Bikaner Airport",
    coords: [28.0706, 73.2072],
  },
  {
    name: "Jaisalmer Airport",
    coords: [26.8881, 70.8645],
  },
  {
    name: "Adampur Airport",
    coords: [31.4334, 75.7586],
  },
  {
    name: "Pathankot Airport",
    coords: [32.235, 75.634],
  },
  {
    name: "Kanpur Airport",
    coords: [26.4042, 80.4105],
  },
  {
    name: "Prayagraj Airport",
    coords: [25.4903, 81.7337],
  },
  {
    name: "Gorakhpur Airport",
    coords: [26.7397, 83.4496],
  },
  {
    name: "Deoghar Airport",
    coords: [24.2483, 86.9293],
  },
  {
    name: "Darbhanga Airport",
    coords: [26.1921, 85.9182],
  },
  {
    name: "Purnea Airport",
    coords: [25.7595, 87.4095],
  },
  {
    name: "Bilaspur Airport",
    coords: [21.9884, 82.1106],
  },
  {
    name: "Jagdalpur Airport",
    coords: [19.0889, 82.0366],
  },
  {
    name: "Ambikapur Airport",
    coords: [23.2255, 83.1957],
  },
  {
    name: "Shimla Airport",
    coords: [31.0815, 77.0694],
  },
  {
    name: "Kullu Airport",
    coords: [31.8767, 77.1544],
  },
  {
    name: "Dharamshala Airport",
    coords: [32.1651, 76.2634],
  },
  {
    name: "Kannur International Airport",
    coords: [11.9184, 75.5472],
  },
  {
    name: "Hindon Airport",
    coords: [28.7397, 77.3645],
  },
  {
    name: "Bareilly Airport",
    coords: [28.4219, 79.4509],
  },
  {
    name: "Sindhudurg Airport",
    coords: [16.0006, 73.5283],
  },
  {
    name: "Kurnool Airport",
    coords: [15.7129, 78.2031],
  },
  {
    name: "Gondia Airport",
    coords: [21.5145, 80.2815],
  },
  {
    name: "Nanded Airport",
    coords: [19.1836, 77.3189],
  },
  {
    name: "John F. Kennedy International Airport",
    coords: [40.6413, -73.7781],
  },
  {
    name: "Los Angeles International Airport",
    coords: [33.9416, -118.4085],
  },
  {
    name: "O'Hare International Airport",
    coords: [41.9742, -87.9073],
  },
  {
    name: "Toronto Pearson International Airport",
    coords: [43.6777, -79.6248],
  },
  {
    name: "Vancouver International Airport",
    coords: [49.1967, -123.1815],
  },

  // Europe
  {
    name: "Heathrow Airport",
    coords: [51.4700, -0.4543],
  },
  {
    name: "Charles de Gaulle Airport",
    coords: [49.0097, 2.5479],
  },
  {
    name: "Amsterdam Airport Schiphol",
    coords: [52.3105, 4.7683],
  },
  {
    name: "Frankfurt Airport",
    coords: [50.0379, 8.5622],
  },
  {
    name: "Madrid Barajas Airport",
    coords: [40.4983, -3.5676],
  },

  // Asia
  {
    name: "Beijing Capital International Airport",
    coords: [40.0799, 116.6031],
  },
  {
    name: "Tokyo Haneda Airport",
    coords: [35.5494, 139.7798],
  },
  {
    name: "Singapore Changi Airport",
    coords: [1.3644, 103.9915],
  },
  {
    name: "Dubai International Airport",
    coords: [25.2532, 55.3657],
  },
  {
    name: "Hong Kong International Airport",
    coords: [22.3080, 113.9185],
  },

  // Australia and Oceania
  {
    name: "Sydney Airport",
    coords: [-33.9399, 151.1753],
  },
  {
    name: "Melbourne Airport",
    coords: [-37.6690, 144.8410],
  },
  {
    name: "Auckland Airport",
    coords: [-37.0082, 174.7850],
  },

  // South America
  {
    name: "São Paulo/Guarulhos International Airport",
    coords: [-23.4356, -46.4731],
  },
  {
    name: "Buenos Aires Ezeiza International Airport",
    coords: [-34.8222, -58.5358],
  },
  {
    name: "Lima Jorge Chávez International Airport",
    coords: [-12.0219, -77.1113],
  },

  // Africa
  {
    name: "O.R. Tambo International Airport",
    coords: [-26.1392, 28.2460],
  },
  {
    name: "Cairo International Airport",
    coords: [30.1219, 31.4056],
  },
  {
    name: "Jomo Kenyatta International Airport",
    coords: [-1.3192, 36.9278],
  },

  // Middle East
  {
    name: "Istanbul Airport",
    coords: [41.2608, 28.7418],
  },
  {
    name: "Doha Hamad International Airport",
    coords: [25.2609, 51.6138],
  },
  {
    name: "Abu Dhabi International Airport",
    coords: [24.4331, 54.6511],
  },

  // Additional Major Hubs
  {
    name: "Seoul Incheon International Airport",
    coords: [37.4602, 126.4407],
  },
  {
    name: "Taiwan Taoyuan International Airport",
    coords: [25.0777, 121.2328],
  },
  {
    name: "Bangkok Suvarnabhumi Airport",
    coords: [13.6900, 100.7501],
  },
  {
    name: "Kuala Lumpur International Airport",
    coords: [2.7456, 101.7072],
  },
  {
    name: "Jakarta Soekarno-Hatta International Airport",
    coords: [-6.1256, 106.6558],
  },
  // Adding intermediate airports for alternative routes
  {
    name: "Rajiv Gandhi International Airport",
    coords: [17.2403, 78.4294],
  },
  {
    name: "Cochin International Airport",
    coords: [10.152, 76.4019],
  },
  {
    name: "Sardar Vallabhbhai Patel International Airport",
    coords: [23.0722, 72.6311],
  },
  {
    name: "Goa International Airport",
    coords: [15.38, 73.8312],
  },
  {
    name: "Jaipur International Airport",
    coords: [26.8242, 75.8028],
  },
  {
    name: "Lokpriya Gopinath Bordoloi International Airport",
    coords: [26.1061, 91.5859],
  },
  {
    name: "Sri Guru Ram Dass Jee International Airport",
    coords: [31.7096, 74.7973],
  },
  {
    name: "Biju Patnaik International Airport",
    coords: [20.2539, 85.8178],
  },
  {
    name: "Devi Ahilya Bai Holkar Airport",
    coords: [22.7216, 75.801],
  },
  {
    name: "Lal Bahadur Shastri International Airport",
    coords: [25.4524, 82.8593],
  },
];

window.airports = airports;
export default airports;
