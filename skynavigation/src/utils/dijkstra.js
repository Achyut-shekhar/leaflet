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
function createGraph(airports, avoidDangerZones = false) {
  const graph = {};
  const MAX_DISTANCE = 5000; // Increased maximum direct flight distance
  const MIN_DISTANCE = 50;   // Minimum distance for connections
  const MAX_STOPS = 12;      // Increased maximum stops for long routes
  const DANGER_ZONE_PENALTY = 1000; // Large penalty for danger zone intersections
  
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
        // Check if this edge intersects with any danger zone
        let edgeDistance = distance;
        let intersectsDangerZone = false;
        
        if (avoidDangerZones) {
          for (const zone of window.dangerZone) {
            if (lineIntersectsPolygon(airports[i].coords, airports[j].coords, zone.coords)) {
              intersectsDangerZone = true;
              edgeDistance += DANGER_ZONE_PENALTY; // Add large penalty for danger zone intersections
              break;
            }
          }
        }

        // Add edge in both directions
        const connectionPenalty = 30; // Base penalty for each connection
        graph[i].push({ 
          to: j, 
          distance: edgeDistance + connectionPenalty,
          intersectsDangerZone 
        });
        graph[j].push({ 
          to: i, 
          distance: edgeDistance + connectionPenalty,
          intersectsDangerZone 
        });
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
        graph[i].push({ to: closestAirport, distance: minDistance + 100, intersectsDangerZone: false });
        graph[closestAirport].push({ to: i, distance: minDistance + 100, intersectsDangerZone: false });
      }
    }
  }

  return graph;
}

// Function to check if a line segment intersects with a polygon
function lineIntersectsPolygon(start, end, polygon) {
  // Check if either endpoint is inside the polygon
  if (pointInPolygon(start, polygon) || pointInPolygon(end, polygon)) {
    return true;
  }

  // Check if the line segment intersects with any polygon edge
  for (let i = 0; i < polygon.length; i++) {
    const j = (i + 1) % polygon.length;
    if (lineIntersectsLine(start, end, polygon[i], polygon[j])) {
      return true;
    }
  }
  return false;
}

// Helper function to check if a point is inside a polygon
function pointInPolygon(point, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];
    
    const intersect = ((yi > point[1]) !== (yj > point[1]))
        && (point[0] < (xj - xi) * (point[1] - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

// Helper function to check if two line segments intersect
function lineIntersectsLine(p1, p2, p3, p4) {
  const ccw = (A, B, C) => {
    return (C[1] - A[1]) * (B[0] - A[0]) > (B[1] - A[1]) * (C[0] - A[0]);
  };
  return ccw(p1, p3, p4) !== ccw(p2, p3, p4) && ccw(p1, p2, p3) !== ccw(p1, p2, p4);
}

// Dijkstra's algorithm implementation
export function findShortestPath(airports, sourceIndex, destinationIndex, customGraph = null) {
  const graph = customGraph || createGraph(airports);
  const distances = {};
  const previous = {};
  const unvisited = new Set();
  const MAX_STOPS = 12; // Increased maximum stops for long routes
  
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
  let intersectsDangerZone = false;
  let dangerZoneNames = new Set();

  // Check each segment of the path for danger zone intersections
  for (let i = 0; i < path.length - 1; i++) {
    const start = airports[path[i]].coords;
    const end = airports[path[i + 1]].coords;
    totalDistance += calculateDistance(start[0], start[1], end[0], end[1]);

    // Check intersection with each danger zone
    for (const zone of window.dangerZone) {
      if (lineIntersectsPolygon(start, end, zone.coords)) {
        intersectsDangerZone = true;
        dangerZoneNames.add(zone.name);
      }
    }
  }
  
  // Convert path indices to airport objects
  const airportPath = path.map(index => airports[index]);
  
  return {
    path: airportPath,
    distance: totalDistance,
    intersectsDangerZone,
    dangerZoneNames: Array.from(dangerZoneNames)
  };
}

// Function to find multiple alternative paths
export const findAlternativePaths = (airports, sourceIndex, destinationIndex, numPaths = 5) => {
  const paths = [];
  const usedEdges = new Set();

  // First try to find a path avoiding danger zones
  const safeGraph = createGraph(airports, true);
  const safePath = findShortestPath(airports, sourceIndex, destinationIndex, safeGraph);
  
  if (safePath && !safePath.intersectsDangerZone) {
    paths.push(safePath);
  } else {
    // If no safe path found, use the regular shortest path
    const firstPath = findShortestPath(airports, sourceIndex, destinationIndex);
    if (!firstPath) return null;
    paths.push(firstPath);
  }

  // Add edges of the first path to used edges
  for (let i = 0; i < paths[0].path.length - 1; i++) {
    const edge = `${paths[0].path[i].name}-${paths[0].path[i + 1].name}`;
    usedEdges.add(edge);
  }

  // Function to create a modified graph with penalties for used edges
  const createModifiedGraph = (penalty, avoidDangerZones = false) => {
    const graph = {};
    const MAX_DISTANCE = 5000;
    const MIN_DISTANCE = 50;
    const DANGER_ZONE_PENALTY = 1000;

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
          
          // Calculate base weight
          let weight = isUsed ? distance * penalty : distance;

          // Add danger zone penalty if avoiding danger zones
          if (avoidDangerZones) {
            for (const zone of window.dangerZone) {
              if (lineIntersectsPolygon(airports[i].coords, airports[j].coords, zone.coords)) {
                weight += DANGER_ZONE_PENALTY;
                break;
              }
            }
          }

          graph[i].push({ to: j, distance: weight });
          graph[j].push({ to: i, distance: weight });
        }
      }
    }
    return graph;
  };

  // Try to find alternative paths with increasing penalties
  const penalties = [2, 3, 4, 5];
  for (const penalty of penalties) {
    if (paths.length >= numPaths) break;

    // Create graph with current penalty and danger zone avoidance
    const modifiedGraph = createModifiedGraph(penalty, true);

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