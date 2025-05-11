// Graph representation for airports
class Graph {
  constructor() {
    this.vertices = new Map(); // Map of airport indices to their neighbors and distances
  }

  addVertex(airportIndex) {
    if (!this.vertices.has(airportIndex)) {
      this.vertices.set(airportIndex, new Map());
    }
  }

  addEdge(sourceIndex, destIndex, distance) {
    this.addVertex(sourceIndex);
    this.addVertex(destIndex);
    this.vertices.get(sourceIndex).set(destIndex, distance);
    this.vertices.get(destIndex).set(sourceIndex, distance); // Undirected graph
  }

  // Check if a line segment intersects with any danger zone
  intersectsDangerZone(start, end, dangerZones) {
    for (const zone of dangerZones) {
      const coords = zone.coords;
      for (let i = 0; i < coords.length; i++) {
        const j = (i + 1) % coords.length;
        if (this.lineIntersects(start, end, coords[i], coords[j])) {
          return true;
        }
      }
    }
    return false;
  }

  // Check if two line segments intersect
  lineIntersects(p1, p2, p3, p4) {
    const ccw = (A, B, C) => {
      return (C[1] - A[1]) * (B[0] - A[0]) > (B[1] - A[1]) * (C[0] - A[0]);
    };
    return ccw(p1, p3, p4) !== ccw(p2, p3, p4) && ccw(p1, p2, p3) !== ccw(p1, p2, p4);
  }

  // Build graph from airports and danger zones
  buildGraph(airports, dangerZones) {
    for (let i = 0; i < airports.length; i++) {
      for (let j = i + 1; j < airports.length; j++) {
        const start = airports[i].coords;
        const end = airports[j].coords;
        
        // Only add edge if it doesn't intersect with danger zones
        if (!this.intersectsDangerZone(start, end, dangerZones)) {
          const distance = this.calculateDistance(start, end);
          this.addEdge(i, j, distance);
        }
      }
    }
  }

  // Calculate distance between two points using Haversine formula
  calculateDistance(point1, point2) {
    const R = 6371; // Earth's radius in km
    const lat1 = point1[0] * Math.PI / 180;
    const lat2 = point2[0] * Math.PI / 180;
    const deltaLat = (point2[0] - point1[0]) * Math.PI / 180;
    const deltaLon = (point2[1] - point1[1]) * Math.PI / 180;

    const a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(deltaLon/2) * Math.sin(deltaLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // Dijkstra's algorithm implementation
  dijkstra(startIndex, endIndex) {
    const distances = new Map();
    const previous = new Map();
    const unvisited = new Set();

    // Initialize distances
    for (const vertex of this.vertices.keys()) {
      distances.set(vertex, Infinity);
      previous.set(vertex, null);
      unvisited.add(vertex);
    }
    distances.set(startIndex, 0);

    while (unvisited.size > 0) {
      // Find vertex with minimum distance
      let minDistance = Infinity;
      let current = null;
      for (const vertex of unvisited) {
        if (distances.get(vertex) < minDistance) {
          minDistance = distances.get(vertex);
          current = vertex;
        }
      }

      if (current === null || current === endIndex) break;

      unvisited.delete(current);

      // Update distances to neighbors
      const neighbors = this.vertices.get(current);
      for (const [neighbor, distance] of neighbors) {
        if (unvisited.has(neighbor)) {
          const newDistance = distances.get(current) + distance;
          if (newDistance < distances.get(neighbor)) {
            distances.set(neighbor, newDistance);
            previous.set(neighbor, current);
          }
        }
      }
    }

    // Reconstruct path
    const path = [];
    let current = endIndex;
    while (current !== null) {
      path.unshift(current);
      current = previous.get(current);
    }

    return {
      path: path,
      distance: distances.get(endIndex)
    };
  }
}

// Export the Graph class
window.Graph = Graph; 