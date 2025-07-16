/**
 * Simple Face Overlay System
 * 
 * Creates textures that LOOK like subdivided faces with black lines,
 * but keeps the simple 12-face structure for solving logic.
 */

import * as THREE from 'three';
import { FaceColor } from '@/types/kilominx';

/**
 * Create a texture for a pentagon face with subdivision lines
 */
export function createSubdividedFaceTexture(
  faceColor: FaceColor,
  textureSize: number = 512
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = textureSize;
  canvas.height = textureSize;
  const ctx = canvas.getContext('2d')!;
  
  // Clear canvas
  ctx.clearRect(0, 0, textureSize, textureSize);
  
  // Draw pentagon background
  drawPentagonBase(ctx, textureSize, faceColor);
  
  // Draw subdivision lines to create ~20 pieces
  drawSubdivisionLines(ctx, textureSize);
  
  // Create Three.js texture
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  texture.flipY = false;
  
  return texture;
}

/**
 * Draw the pentagon background
 */
function drawPentagonBase(
  ctx: CanvasRenderingContext2D, 
  size: number, 
  color: FaceColor
) {
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 0.45;
  
  // Draw pentagon shape
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();
  
  // Fill with face color
  ctx.fillStyle = color;
  ctx.fill();
  
  // Black pentagon border
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 4;
  ctx.stroke();
}

/**
 * Draw subdivision lines to create the appearance of ~20 pieces
 */
function drawSubdivisionLines(ctx: CanvasRenderingContext2D, size: number) {
  const centerX = size / 2;
  const centerY = size / 2;
  
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 3;
  
  // Draw star pattern in center (like your photo)
  drawCenterStar(ctx, centerX, centerY, size * 0.15);
  
  // Draw radial lines from center to edges
  drawRadialLines(ctx, centerX, centerY, size);
  
  // Draw concentric rings
  drawConcentricRings(ctx, centerX, centerY, size);
  
  // Draw edge subdivisions
  drawEdgeSubdivisions(ctx, centerX, centerY, size);
}

/**
 * Draw center star pattern (like the black star in your photo)
 */
function drawCenterStar(
  ctx: CanvasRenderingContext2D, 
  centerX: number, 
  centerY: number, 
  radius: number
) {
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();
  ctx.fillStyle = '#000000';
  ctx.fill();
}

/**
 * Draw radial lines from center star to pentagon edges
 */
function drawRadialLines(
  ctx: CanvasRenderingContext2D, 
  centerX: number, 
  centerY: number, 
  size: number
) {
  const innerRadius = size * 0.15;
  const outerRadius = size * 0.4;
  
  for (let i = 0; i < 5; i++) {
    const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
    
    const x1 = centerX + Math.cos(angle) * innerRadius;
    const y1 = centerY + Math.sin(angle) * innerRadius;
    const x2 = centerX + Math.cos(angle) * outerRadius;
    const y2 = centerY + Math.sin(angle) * outerRadius;
    
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
}

/**
 * Draw concentric rings to create layers
 */
function drawConcentricRings(
  ctx: CanvasRenderingContext2D, 
  centerX: number, 
  centerY: number, 
  size: number
) {
  const rings = [0.2, 0.32, 0.42];
  
  rings.forEach(radiusRatio => {
    const radius = size * radiusRatio;
    
    ctx.beginPath();
    for (let i = 0; i <= 5; i++) {
      const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.stroke();
  });
}

/**
 * Draw edge subdivisions to create more pieces
 */
function drawEdgeSubdivisions(
  ctx: CanvasRenderingContext2D, 
  centerX: number, 
  centerY: number, 
  size: number
) {
  const radius1 = size * 0.25;
  const radius2 = size * 0.35;
  
  // Draw connecting lines between rings
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 2; j++) {
      const baseAngle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
      const offset = (j - 0.5) * 0.3;
      const angle = baseAngle + offset;
      
      const x1 = centerX + Math.cos(angle) * radius1;
      const y1 = centerY + Math.sin(angle) * radius1;
      const x2 = centerX + Math.cos(angle) * radius2;
      const y2 = centerY + Math.sin(angle) * radius2;
      
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  }
}

/**
 * Update the color of a face texture
 */
export function updateFaceColor(
  texture: THREE.CanvasTexture,
  newColor: FaceColor
): void {
  const canvas = texture.source.data as HTMLCanvasElement;
  const ctx = canvas.getContext('2d')!;
  
  // Redraw with new color
  drawPentagonBase(ctx, canvas.width, newColor);
  drawSubdivisionLines(ctx, canvas.width);
  
  texture.needsUpdate = true;
}