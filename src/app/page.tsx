export default function Home() {
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
            <div className="bg-gray-800 rounded-lg p-6 h-96 flex items-center justify-center">
              <p className="text-gray-400">
                3D Kilominx will render here
              </p>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="space-y-6">
            {/* Color Palette */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Color Palette</h3>
              <p className="text-gray-400 text-sm">
                Color selection will go here
              </p>
            </div>

            {/* Solution Steps */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Solution Steps</h3>
              <p className="text-gray-400 text-sm">
                Step-by-step solution will appear here
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}