class Graph {
    constructor() {
        this.vertices = new Map();
        this.dangerZones = [];
    }

    buildGraph(airports, dangerZones) {
        console.log('Building graph with', airports.length, 'airports');
        this.dangerZones = dangerZones;
        
        // Create vertices for each airport
        airports.forEach((airport, index) => {
            this.vertices.set(index, new Map());
        });

        // Add edges between airports
        let edgeCount = 0;
        for (let i = 0; i < airports.length; i++) {
            for (let j = i + 1; j < airports.length; j++) {
                const distance = this.calculateDistance(airports[i].coords, airports[j].coords);
                if (distance <= 5000 && !this.intersectsDangerZone(airports[i].coords, airports[j].coords)) {
                    this.vertices.get(i).set(j, distance);
                    this.vertices.get(j).set(i, distance);
                    edgeCount++;
                }
            }
        }
        console.log('Graph built with', edgeCount, 'edges');
    }

    calculateDistance(coord1, coord2) {
        const R = 6371; // Earth's radius in km
        const lat1 = coord1[0] * Math.PI / 180;
        const lat2 = coord2[0] * Math.PI / 180;
        const deltaLat = (coord2[0] - coord1[0]) * Math.PI / 180;
        const deltaLon = (coord2[1] - coord1[1]) * Math.PI / 180;

        const a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
                Math.cos(lat1) * Math.cos(lat2) *
                Math.sin(deltaLon/2) * Math.sin(deltaLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    intersectsDangerZone(coord1, coord2) {
        for (const zone of this.dangerZones) {
            if (this.lineIntersectsPolygon(coord1, coord2, zone.coords)) {
                return true;
            }
        }
        return false;
    }

    lineIntersectsPolygon(lineStart, lineEnd, polygon) {
        for (let i = 0; i < polygon.length; i++) {
            const j = (i + 1) % polygon.length;
            if (this.lineIntersectsLine(lineStart, lineEnd, polygon[i], polygon[j])) {
                return true;
            }
        }
        return false;
    }

    lineIntersectsLine(line1Start, line1End, line2Start, line2End) {
        const ccw = (A, B, C) => {
            return (C[1] - A[1]) * (B[0] - A[0]) > (B[1] - A[1]) * (C[0] - A[0]);
        };
        return ccw(line1Start, line2Start, line2End) !== ccw(line1End, line2Start, line2End) &&
               ccw(line1Start, line1End, line2Start) !== ccw(line1Start, line1End, line2End);
    }

    async dijkstra(start, end) {
        const distances = new Map();
        const previous = new Map();
        const unvisited = new Set();
        const visited = new Set();

        // Initialize distances
        for (const vertex of this.vertices.keys()) {
            distances.set(vertex, Infinity);
            previous.set(vertex, null);
            unvisited.add(vertex);
        }
        distances.set(start, 0);

        while (unvisited.size > 0) {
            // Find vertex with minimum distance
            let minDist = Infinity;
            let current = null;
            for (const vertex of unvisited) {
                if (distances.get(vertex) < minDist) {
                    minDist = distances.get(vertex);
                    current = vertex;
                }
            }

            if (current === null || current === end) break;

            unvisited.delete(current);
            visited.add(current);

            // Explore neighbors
            for (const [neighbor, weight] of this.vertices.get(current)) {
                if (!visited.has(neighbor)) {
                    const newDist = distances.get(current) + weight;
                    if (newDist < distances.get(neighbor)) {
                        distances.set(neighbor, newDist);
                        previous.set(neighbor, current);
                    }
                }
            }
        }

        // Reconstruct path
        const path = [];
        let current = end;
        while (current !== null) {
            path.unshift(current);
            current = previous.get(current);
        }

        return {
            path: path,
            distance: distances.get(end)
        };
    }
} 