'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { createKilominxGeometry, getDefaultColors } from '@/lib/kilominx/geometry';
import { FaceColor } from '@/types/kilominx';

interface KilominxRendererProps {
  faceColors?: FaceColor[];
  onFaceClick?: (faceId: number) => void;
  selectedColor?: FaceColor;
  width?: number;
  height?: number;
}

export const KilominxRenderer: React.FC<KilominxRendererProps> = ({
  faceColors,
  onFaceClick,
  selectedColor = FaceColor.RED,
  width = 800,
  height = 600
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const kilominxRef = useRef<THREE.Mesh | null>(null);
  const materialsRef = useRef<THREE.MeshPhongMaterial[]>([]);
  const animationIdRef = useRef<number | null>(null);
  
  const mouseStateRef = useRef({
    isMouseDown: false,
    lastX: 0,
    lastY: 0,
    rotationX: 0,
    rotationY: 0
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFace, setSelectedFace] = useState<number | null>(null);
  const [currentColors, setCurrentColors] = useState<FaceColor[]>(
    faceColors || getDefaultColors()
  );
  
  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    mouseStateRef.current.isMouseDown = true;
    mouseStateRef.current.lastX = event.clientX;
    mouseStateRef.current.lastY = event.clientY;
  }, []);
  
  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (!mouseStateRef.current.isMouseDown || !kilominxRef.current) return;
    
    const deltaX = event.clientX - mouseStateRef.current.lastX;
    const deltaY = event.clientY - mouseStateRef.current.lastY;
    
    mouseStateRef.current.rotationY += deltaX * 0.01;
    mouseStateRef.current.rotationX += deltaY * 0.01;
    
    kilominxRef.current.rotation.x = mouseStateRef.current.rotationX;
    kilominxRef.current.rotation.y = mouseStateRef.current.rotationY;
    
    mouseStateRef.current.lastX = event.clientX;
    mouseStateRef.current.lastY = event.clientY;
  }, []);
  
  const handleMouseUp = useCallback(() => {
    mouseStateRef.current.isMouseDown = false;
  }, []);
  
  const handleClick = useCallback((event: React.MouseEvent) => {
    if (!cameraRef.current || !sceneRef.current || !kilominxRef.current || !onFaceClick) return;
    
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const mouse = new THREE.Vector2();
    mouse.x = ((event.clientX - rect.left) / width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / height) * 2 + 1;
    
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);
    
    const intersects = raycaster.intersectObject(kilominxRef.current);
    
    if (intersects.length > 0) {
      const intersection = intersects[0];
      const faceIndex = Math.floor(intersection.faceIndex! / 2);
      
      console.log(`Clicked face ${faceIndex}`);
      setSelectedFace(faceIndex);
      onFaceClick(faceIndex);
      
      const newColors = [...currentColors];
      newColors[faceIndex] = selectedColor;
      setCurrentColors(newColors);
      
      // Update face color using texture system
      import('@/lib/kilominx/face-overlay').then(({ updateFaceColor }) => {
        const faceMaterial = materialsRef.current[faceIndex];
        if (faceMaterial && faceMaterial.map) {
          updateFaceColor(faceMaterial.map as THREE.CanvasTexture, selectedColor);
        }
      });
    }
  }, [onFaceClick, width, height, selectedColor, currentColors]);
  
  useEffect(() => {
    if (!mountRef.current) return;
    
    console.log('Initializing clean kilominx...');
    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    sceneRef.current = scene;
    
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(6, 4, 6);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;
    
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: false
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    
    mountRef.current.appendChild(renderer.domElement);
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(-5, 5, -5);
    scene.add(fillLight);
    
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.ShadowMaterial({
      opacity: 0.1
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -3;
    ground.receiveShadow = true;
    scene.add(ground);
    
    const geometry = new THREE.DodecahedronGeometry(2.5, 0);
    
    // Import face overlay system
    import('@/lib/kilominx/face-overlay').then(({ createSubdividedFaceTexture }) => {
      
      // Create materials with subdivision textures for each face
      const materials: THREE.MeshPhongMaterial[] = [];
      
      for (let i = 0; i < 12; i++) {
        // Create texture showing subdivided face
        const faceTexture = createSubdividedFaceTexture(currentColors[i]);
        
        const material = new THREE.MeshPhongMaterial({
          map: faceTexture,
          shininess: 30,
          specular: 0x222222,
          transparent: false,
          side: THREE.FrontSide
        });
        
        materials.push(material);
      }
      
      materialsRef.current = materials;
      
      // Create mesh with textured materials
      const kilominx = new THREE.Mesh(geometry, materials);
      kilominx.castShadow = true;
      kilominx.receiveShadow = true;
      
      // Set up face groups for materials
      const positionAttribute = geometry.getAttribute('position');
      const faceCount = positionAttribute.count / 3;
      
      for (let i = 0; i < faceCount; i++) {
        const materialIndex = Math.floor(i / 10);
        geometry.addGroup(i * 3, 3, materialIndex % 12);
      }
      
      scene.add(kilominx);
      kilominxRef.current = kilominx;
      
      console.log('Subdivided kilominx created');
      setIsLoading(false);
    });
    
    const animate = () => {
      if (!renderer || !scene || !camera) return;
      
      renderer.render(scene, camera);
      animationIdRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      
      if (renderer && mountRef.current && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      
      materials.forEach(material => material.dispose());
      geometry.dispose();
    };
  }, [width, height]);
  
  useEffect(() => {
    if (faceColors) {
      setCurrentColors(faceColors);
      
      faceColors.forEach((color, index) => {
        if (materialsRef.current[index]) {
          materialsRef.current[index].color.setHex(new THREE.Color(color).getHex());
        }
      });
    }
  }, [faceColors]);
  
  return (
    <div className="relative bg-white rounded-lg overflow-hidden shadow-lg">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white rounded-lg z-10">
          <div className="text-gray-600 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
            <div className="text-sm font-medium">Loading kilominx...</div>
          </div>
        </div>
      )}
      
      <div
        ref={mountRef}
        className="kilominx-renderer cursor-grab active:cursor-grabbing bg-white"
        style={{ width, height }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleClick}
        data-testid="kilominx-canvas"
      />
      
      {selectedFace !== null && (
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-gray-800 px-4 py-3 rounded-lg shadow-lg border text-sm">
          <div className="font-semibold text-gray-900">Face {selectedFace}</div>
          <div className="text-xs text-gray-600 mt-1">
            Click to paint with selected color
          </div>
        </div>
      )}
      
      <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm text-gray-700 px-4 py-3 rounded-lg shadow-lg border text-xs">
        <div className="flex items-center space-x-2 mb-1">
          <span className="text-blue-600">🖱️</span>
          <span className="font-medium">Drag to rotate</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-green-600">🎨</span>
          <span className="font-medium">Click faces to color</span>
        </div>
      </div>
      
      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-gray-600 px-3 py-2 rounded-lg shadow-lg border text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>12 faces • Visual subdivision</span>
        </div>
      </div>
    </div>
  );
};

export default KilominxRenderer;