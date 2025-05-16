// Calculate distance between two points using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
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

// Create adjacency list for airports
function createGraph(airports) {
  const graph = {};
  const MAX_DISTANCE = 3000; // Maximum direct flight distance
  const MIN_DISTANCE = 50;   // Minimum distance for connections
  
  // Initialize graph with all airports
  airports.forEach((airport, index) => {
    graph[index] = [];
  });

  // Create edges between airports that are within reasonable flying distance
  for (let i = 0; i < airports.length; i++) {
    for (let j = i + 1; j < airports.length; j++) {
      const distance = calculateDistance(
        airports[i].coords[0],
        airports[i].coords[1],
        airports[j].coords[0],
        airports[j].coords[1]
      );
      
      // Only add edge if airports are within reasonable flying distance
      if (distance <= MAX_DISTANCE && distance >= MIN_DISTANCE) {
        // Add edge in both directions with a small penalty for each connection
        const connectionPenalty = 30; // Penalty for each connection
        graph[i].push({ to: j, distance: distance + connectionPenalty });
        graph[j].push({ to: i, distance: distance + connectionPenalty });
      }
    }
  }

  // Ensure the graph is connected by adding long-distance connections if needed
  for (let i = 0; i < airports.length; i++) {
    if (graph[i].length === 0) {
      // Find the closest airport that has connections
      let closestAirport = null;
      let minDistance = Infinity;
      
      for (let j = 0; j < airports.length; j++) {
        if (i !== j && graph[j].length > 0) {
          const distance = calculateDistance(
            airports[i].coords[0],
            airports[i].coords[1],
            airports[j].coords[0],
            airports[j].coords[1]
          );
          
          if (distance < minDistance) {
            minDistance = distance;
            closestAirport = j;
          }
        }
      }
      
      if (closestAirport !== null) {
        // Add connection to the closest airport
        graph[i].push({ to: closestAirport, distance: minDistance + 100 });
        graph[closestAirport].push({ to: i, distance: minDistance + 100 });
      }
    }
  }

  return graph;
}

// Dijkstra's algorithm implementation
export function findShortestPath(airports, sourceIndex, destinationIndex, customGraph = null) {
  const graph = customGraph || createGraph(airports);
  const distances = {};
  const previous = {};
  const unvisited = new Set();
  const MAX_STOPS = 8; // Maximum number of stops allowed
  
  // Initialize distances and unvisited set
  airports.forEach((_, index) => {
    distances[index] = Infinity;
    previous[index] = null;
    unvisited.add(index);
  });
  
  distances[sourceIndex] = 0;
  
  while (unvisited.size > 0) {
    // Find unvisited node with smallest distance
    let current = null;
    let smallestDistance = Infinity;
    
    for (const node of unvisited) {
      if (distances[node] < smallestDistance) {
        current = node;
        smallestDistance = distances[node];
      }
    }
    
    if (current === null || current === destinationIndex) {
      break;
    }
    
    unvisited.delete(current);
    
    // Update distances to neighbors
    for (const neighbor of graph[current]) {
      const distance = distances[current] + neighbor.distance;
      
      // Count number of stops in current path
      let stops = 0;
      let temp = current;
      while (temp !== null) {
        stops++;
        temp = previous[temp];
      }
      
      // Only update if within maximum stops limit
      if (distance < distances[neighbor.to] && stops < MAX_STOPS) {
        distances[neighbor.to] = distance;
        previous[neighbor.to] = current;
      }
    }
  }
  
  // Reconstruct path
  const path = [];
  let current = destinationIndex;
  
  while (current !== null) {
    path.unshift(current);
    current = previous[current];
  }
  
  // If no path found, try to find a path with more stops
  if (path[0] !== sourceIndex) {
    return null;
  }
  
  // Calculate total distance (excluding connection penalties)
  let totalDistance = 0;
  for (let i = 0; i < path.length - 1; i++) {
    totalDistance += calculateDistance(
      airports[path[i]].coords[0],
      airports[path[i]].coords[1],
      airports[path[i + 1]].coords[0],
      airports[path[i + 1]].coords[1]
    );
  }
  
  // Convert path indices to airport objects
  const airportPath = path.map(index => airports[index]);
  
  return {
    path: airportPath,
    distance: totalDistance
  };
}

// Function to find multiple alternative paths
export const findAlternativePaths = (airports, sourceIndex, destinationIndex, numPaths = 5) => {
  const paths = [];
  const usedEdges = new Set();

  // Find the first path (shortest path)
  const firstPath = findShortestPath(airports, sourceIndex, destinationIndex);
  if (!firstPath) return null;

  paths.push(firstPath);

  // Add edges of the first path to used edges
  for (let i = 0; i < firstPath.path.length - 1; i++) {
    const edge = `${firstPath.path[i].name}-${firstPath.path[i + 1].name}`;
    usedEdges.add(edge);
  }

  // Function to create a modified graph with penalties for used edges
  const createModifiedGraph = (penalty) => {
    const graph = {};
    const MAX_DISTANCE = 3000;
    const MIN_DISTANCE = 50;

    // Initialize graph
    airports.forEach((_, index) => {
      graph[index] = [];
    });

    // Add edges with penalties
    for (let i = 0; i < airports.length; i++) {
      for (let j = i + 1; j < airports.length; j++) {
        const distance = calculateDistance(
          airports[i].coords[0],
          airports[i].coords[1],
          airports[j].coords[0],
          airports[j].coords[1]
        );

        if (distance <= MAX_DISTANCE && distance >= MIN_DISTANCE) {
          const edge = `${airports[i].name}-${airports[j].name}`;
          const reverseEdge = `${airports[j].name}-${airports[i].name}`;
          const isUsed = usedEdges.has(edge) || usedEdges.has(reverseEdge);
          
          // Apply penalty to used edges
          const weight = isUsed ? distance * penalty : distance;
          graph[i].push({ to: j, distance: weight });
          graph[j].push({ to: i, distance: weight });
        }
      }
    }
    return graph;
  };

  // Try to find the next 4 paths with increasing penalties
  const penalties = [2, 3, 4, 5];
  for (const penalty of penalties) {
    if (paths.length >= numPaths) break;

    // Create graph with current penalty
    const modifiedGraph = createModifiedGraph(penalty);

    // Find next path using the modified graph
    const nextPath = findShortestPath(airports, sourceIndex, destinationIndex, modifiedGraph);
    if (!nextPath) continue;

    // Add this path and its edges
    paths.push(nextPath);
    for (let j = 0; j < nextPath.path.length - 1; j++) {
      const edge = `${nextPath.path[j].name}-${nextPath.path[j + 1].name}`;
      usedEdges.add(edge);
    }
  }

  // Sort paths by total distance
  paths.sort((a, b) => a.distance - b.distance);

  return paths;
}; 