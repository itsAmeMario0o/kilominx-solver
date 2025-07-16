/**
 * Simple Working Kilominx Geometry
 * 
 * Clean version with no complex dependencies.
 */

import { Vector3, Face, KilominxGeometry, FaceColor } from '@/types/kilominx';

/**
 * Create simple kilominx with 12 faces
 */
export function createKilominxGeometry(): KilominxGeometry {
  console.log('Creating simple kilominx geometry...');
  
  const faces: Face[] = [];
  
  // Create 12 faces for the dodecahedron
  for (let i = 0; i < 12; i++) {
    const face: Face = {
      id: i,
      color: FaceColor.WHITE,
      center: { x: 0, y: 0, z: 0 },
      normal: { x: 0, y: 1, z: 0 },
      vertices: [],
      neighbors: [],
      majorFace: i,
      ring: 0,
      ringPosition: 0
    };
    faces.push(face);
  }
  
  const geometry: KilominxGeometry = {
    faces: faces,
    radius: 2.0,
    scale: 2.0
  };
  
  console.log(`Created kilominx with ${faces.length} faces`);
  return geometry;
}

/**
 * Get solved state colors
 */
export function getSolvedStateColors(): FaceColor[] {
  return [
    FaceColor.WHITE,
    FaceColor.YELLOW,
    FaceColor.DARK_BLUE,
    FaceColor.LIGHT_BLUE,
    FaceColor.RED,
    FaceColor.PINK,
    FaceColor.ORANGE,
    FaceColor.LIGHT_GREEN,
    FaceColor.DARK_GREEN,
    FaceColor.PURPLE,
    FaceColor.GREY,
    FaceColor.DARK_BROWN
  ];
}

/**
 * Get default colors (all white)
 */
export function getDefaultColors(): FaceColor[] {
  return new Array(12).fill(FaceColor.WHITE);
}

export function validateGeometry(geometry: KilominxGeometry): boolean {
  return geometry.faces.length === 12;
}