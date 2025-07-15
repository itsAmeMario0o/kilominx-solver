/**
 * Kilominx Geometry Calculations
 * 
 * This module handles all the complex 3D mathematics for generating
 * a kilominx (4x4 dodecahedron) geometry. A kilominx has 62 individual
 * pentagonal faces arranged on a dodecahedron base.
 */

import { Vector3, Face, KilominxGeometry, FaceColor } from '@/types/kilominx';

// ===== MATHEMATICAL CONSTANTS =====

/** Golden ratio - fundamental to dodecahedron geometry */
const PHI = (1 + Math.sqrt(5)) / 2; // ≈ 1.618

/** Inverse golden ratio */
const PHI_INV = 1 / PHI; // ≈ 0.618

/** Overall scale factor for the kilominx */
const SCALE = 2.0;

// ===== UTILITY FUNCTIONS =====

/**
 * Create a Vector3 object
 */
export function createVector3(x: number, y: number, z: number): Vector3 {
  return { x, y, z };
}

/**
 * Normalize a vector to unit length
 */
export function normalizeVector(v: Vector3): Vector3 {
  const length = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
  if (length === 0) return { x: 0, y: 0, z: 0 };
  
  return {
    x: v.x / length,
    y: v.y / length,
    z: v.z / length
  };
}

/**
 * Scale a vector by a factor
 */
export function scaleVector(v: Vector3, scale: number): Vector3 {
  return {
    x: v.x * scale,
    y: v.y * scale,
    z: v.z * scale
  };
}

/**
 * Add two vectors
 */
export function addVectors(a: Vector3, b: Vector3): Vector3 {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
    z: a.z + b.z
  };
}

/**
 * Cross product of two vectors
 */
export function crossProduct(a: Vector3, b: Vector3): Vector3 {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x
  };
}

// ===== DODECAHEDRON BASE GEOMETRY =====

/**
 * Generate the 12 vertices of a regular dodecahedron
 * These form the centers of the 12 major faces
 */
function generateDodecahedronVertices(): Vector3[] {
  const vertices: Vector3[] = [];
  
  // The 20 vertices of an icosahedron become face centers of dodecahedron
  // But we need the 12 face centers of the dodecahedron itself
  
  // 8 vertices of a cube scaled by golden ratio relationships
  const cubeVertices = [
    [1, 1, 1], [1, 1, -1], [1, -1, 1], [1, -1, -1],
    [-1, 1, 1], [-1, 1, -1], [-1, -1, 1], [-1, -1, -1]
  ];
  
  cubeVertices.forEach(([x, y, z]) => {
    vertices.push(createVector3(x * SCALE, y * SCALE, z * SCALE));
  });
  
  // 4 vertices on each axis, scaled by golden ratio
  const axisVertices = [
    [0, PHI, PHI_INV], [0, PHI, -PHI_INV], [0, -PHI, PHI_INV], [0, -PHI, -PHI_INV],
    [PHI_INV, 0, PHI], [PHI_INV, 0, -PHI], [-PHI_INV, 0, PHI], [-PHI_INV, 0, -PHI],
    [PHI, PHI_INV, 0], [PHI, -PHI_INV, 0], [-PHI, PHI_INV, 0], [-PHI, -PHI_INV, 0]
  ];
  
  axisVertices.forEach(([x, y, z]) => {
    vertices.push(createVector3(x * SCALE, y * SCALE, z * SCALE));
  });
  
  // Return only the first 12 vertices (the face centers we need)
  return vertices.slice(0, 12);
}

/**
 * Generate the 12 major face centers and normals
 */
function generateMajorFaces(): Array<{ center: Vector3; normal: Vector3 }> {
  const vertices = generateDodecahedronVertices();
  
  return vertices.map(center => ({
    center,
    normal: normalizeVector(center) // Normal points outward from origin
  }));
}

// ===== PENTAGON GENERATION =====

/**
 * Generate vertices for a regular pentagon in 3D space
 */
function generatePentagonVertices(
  center: Vector3, 
  normal: Vector3, 
  radius: number
): Vector3[] {
  const vertices: Vector3[] = [];
  
  // Create two perpendicular vectors in the plane of the pentagon
  // Choose an arbitrary vector not parallel to normal
  let up = createVector3(0, 1, 0);
  if (Math.abs(normal.y) > 0.9) {
    up = createVector3(1, 0, 0);
  }
  
  // Create orthogonal basis vectors
  const right = normalizeVector(crossProduct(up, normal));
  const forward = normalizeVector(crossProduct(normal, right));
  
  // Generate 5 vertices of pentagon
  for (let i = 0; i < 5; i++) {
    const angle = (i * 2 * Math.PI) / 5;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    
    // Transform to 3D space
    const vertex = addVectors(center, addVectors(
      scaleVector(right, x),
      scaleVector(forward, y)
    ));
    
    vertices.push(vertex);
  }
  
  return vertices;
}

// ===== KILOMINX FACE GENERATION =====

/**
 * Generate all 62 faces of the kilominx
 */
function generateKilominxFaces(): Face[] {
  const faces: Face[] = [];
  const majorFaces = generateMajorFaces();
  
  majorFaces.forEach((majorFace, majorIndex) => {
    // Each major face has multiple sub-faces:
    // - 1 center pentagon
    // - 5 inner ring pentagons  
    // - 5 outer ring pentagons (except on corner faces)
    
    const isCornerFace = majorIndex < 8; // First 8 are corner faces
    const faceRadius = 0.8;
    
    // Center face
    const centerFace: Face = {
      id: faces.length,
      color: FaceColor.WHITE, // Default to white
      center: majorFace.center,
      normal: majorFace.normal,
      vertices: generatePentagonVertices(majorFace.center, majorFace.normal, faceRadius * 0.3),
      neighbors: [], // Will be calculated later
      majorFace: majorIndex,
      ring: 0,
      ringPosition: 0
    };
    faces.push(centerFace);
    
    // Inner ring faces (5 faces around center)
    for (let i = 0; i < 5; i++) {
      const angle = (i * 2 * Math.PI) / 5;
      const offset = scaleVector({
        x: Math.cos(angle),
        y: Math.sin(angle),
        z: 0
      }, faceRadius * 0.6);
      
      // Transform offset to face orientation
      const faceCenter = addVectors(majorFace.center, offset);
      
      const innerFace: Face = {
        id: faces.length,
        color: FaceColor.WHITE,
        center: faceCenter,
        normal: majorFace.normal,
        vertices: generatePentagonVertices(faceCenter, majorFace.normal, faceRadius * 0.25),
        neighbors: [],
        majorFace: majorIndex,
        ring: 1,
        ringPosition: i
      };
      faces.push(innerFace);
    }
    
    // Outer ring faces (only for edge faces, not corners)
    if (!isCornerFace) {
      for (let i = 0; i < 5; i++) {
        const angle = (i * 2 * Math.PI) / 5;
        const offset = scaleVector({
          x: Math.cos(angle),
          y: Math.sin(angle),
          z: 0
        }, faceRadius);
        
        const faceCenter = addVectors(majorFace.center, offset);
        
        const outerFace: Face = {
          id: faces.length,
          color: FaceColor.WHITE,
          center: faceCenter,
          normal: majorFace.normal,
          vertices: generatePentagonVertices(faceCenter, majorFace.normal, faceRadius * 0.2),
          neighbors: [],
          majorFace: majorIndex,
          ring: 2,
          ringPosition: i
        };
        faces.push(outerFace);
      }
    }
  });
  
  return faces;
}

/**
 * Calculate neighbor relationships between faces
 */
function calculateNeighbors(faces: Face[]): Face[] {
  const facesWithNeighbors = [...faces];
  
  facesWithNeighbors.forEach((face, index) => {
    const neighbors: number[] = [];
    
    // Find faces that are close enough to be neighbors
    facesWithNeighbors.forEach((otherFace, otherIndex) => {
      if (index === otherIndex) return;
      
      // Calculate distance between face centers
      const dx = face.center.x - otherFace.center.x;
      const dy = face.center.y - otherFace.center.y;
      const dz = face.center.z - otherFace.center.z;
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
      
      // If faces are close enough, they're neighbors
      const threshold = 1.5; // Adjust based on face sizes
      if (distance < threshold) {
        neighbors.push(otherIndex);
      }
    });
    
    face.neighbors = neighbors;
  });
  
  return facesWithNeighbors;
}

// ===== MAIN GEOMETRY CREATION =====

/**
 * Create the complete kilominx geometry
 */
export function createKilominxGeometry(): KilominxGeometry {
  console.log('Generating kilominx geometry...');
  
  // Generate all faces
  const faces = generateKilominxFaces();
  console.log(`Generated ${faces.length} faces`);
  
  // Calculate neighbor relationships
  const facesWithNeighbors = calculateNeighbors(faces);
  
  const geometry: KilominxGeometry = {
    faces: facesWithNeighbors,
    radius: SCALE,
    scale: SCALE
  };
  
  console.log('Kilominx geometry complete');
  return geometry;
}

/**
 * Get the default solved state colors for each face
 */
export function getSolvedStateColors(): FaceColor[] {
  const colors: FaceColor[] = [];
  const colorMap = [
    FaceColor.WHITE,      // Face 0
    FaceColor.YELLOW,     // Face 1  
    FaceColor.DARK_BLUE,  // Face 2
    FaceColor.LIGHT_BLUE, // Face 3
    FaceColor.RED,        // Face 4
    FaceColor.PINK,       // Face 5
    FaceColor.ORANGE,     // Face 6
    FaceColor.LIGHT_GREEN,// Face 7
    FaceColor.DARK_GREEN, // Face 8
    FaceColor.PURPLE,     // Face 9
    FaceColor.GREY,       // Face 10
    FaceColor.DARK_BROWN  // Face 11
  ];
  
  // Create geometry to know how many faces we have
  const geometry = createKilominxGeometry();
  
  // Assign colors based on major face
  geometry.faces.forEach(face => {
    const majorFaceColor = colorMap[face.majorFace % colorMap.length];
    colors.push(majorFaceColor);
  });
  
  return colors;
}

/**
 * Validate that a geometry is correct
 */
export function validateGeometry(geometry: KilominxGeometry): boolean {
  const { faces } = geometry;
  
  // Check that we have the right number of faces
  if (faces.length !== 62) {
    console.error(`Expected 62 faces, got ${faces.length}`);
    return false;
  }
  
  // Check that each face has valid properties
  for (const face of faces) {
    if (!face.center || !face.normal || !face.vertices) {
      console.error(`Face ${face.id} missing required properties`);
      return false;
    }
    
    if (face.vertices.length !== 5) {
      console.error(`Face ${face.id} should have 5 vertices, has ${face.vertices.length}`);
      return false;
    }
  }
  
  console.log('Geometry validation passed');
  return true;
}