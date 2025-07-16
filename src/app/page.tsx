'use client';

import { useState } from 'react';
import KilominxRenderer from '@/components/Cube/KilominxRenderer';
import { FaceColor } from '@/types/kilominx';

export default function Home() {
  const [selectedColor, setSelectedColor] = useState<FaceColor>(FaceColor.RED);
  const [selectedFace, setSelectedFace] = useState<number | null>(null);

  const handleFaceClick = (faceId: number) => {
    console.log(`Face ${faceId} clicked`);
    setSelectedFace(faceId);
  };

  const handleColorSelect = (color: FaceColor) => {
    setSelectedColor(color);
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Kilominx Solver
          </h1>
          <p className="text-gray-400">
            Interactive 3D solver for the kilominx puzzle
          </p>
        </header>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 3D Cube Viewer */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg p-6">
              <KilominxRenderer
                width={800}
                height={600}
                onFaceClick={handleFaceClick}
                selectedColor={selectedColor}
              />
            </div>
          </div>

          {/* Controls Panel */}
          <div className="space-y-6">
            {/* Color Palette */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Color Palette</h3>
              <div className="grid grid-cols-3 gap-2">
                {Object.values(FaceColor).map((color) => (
                  <button
                    key={color}
                    className={`w-12 h-12 rounded border-2 transition-all ${
                      selectedColor === color 
                        ? 'border-white scale-110' 
                        : 'border-gray-600 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorSelect(color)}
                    title={color}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-400 mt-4">
                Selected: <span style={{ color: selectedColor }}>{selectedColor}</span>
              </p>
            </div>

            {/* Face Info */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Face Selection</h3>
              {selectedFace !== null ? (
                <div className="text-sm text-gray-300">
                  <p>Selected Face: <span className="text-white font-mono">#{selectedFace}</span></p>
                  <p className="mt-2">Click a face on the kilominx to select it, then choose a color to paint it.</p>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">
                  Click any face on the kilominx to select it
                </p>
              )}
            </div>

            {/* Solution Steps */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Solution Steps</h3>
              <p className="text-gray-400 text-sm">
                Step-by-step solution will appear here once the solving algorithm is implemented.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}