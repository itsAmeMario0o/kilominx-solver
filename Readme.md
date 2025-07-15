# Kilominx Solver

A web-based application for solving the kilominx puzzle - a 4x4 dodecahedron twisty puzzle. Built with Next.js, TypeScript, and Three.js for an interactive 3D solving experience.

## 🧩 About Kilominx

The kilominx is one of the most challenging twisty puzzles, featuring:
- **4x4 dodecahedron geometry** with 12 pentagonal faces
- **62 individual stickers** to solve
- **Complex solving algorithms** requiring layer-by-layer approaches

## 🚀 Features

- **Interactive 3D Visualization**: Full 3D kilominx model with smooth rotations
- **Manual Color Input**: Click to color each face and input your cube state
- **Animated Step-by-Step Solution**: Watch the solving algorithm in action
- **Mobile-Friendly**: Responsive design with touch controls for tablets and phones
- **Real-Time Manipulation**: Intuitive trackball controls for viewing all angles

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **3D Graphics**: Three.js for rendering and animations
- **Styling**: Tailwind CSS for responsive UI
- **Deployment**: Azure Static Web Apps
- **Version Control**: Git with comprehensive documentation

## 📁 Project Structure

```
kilominx-solver/
├── src/
│   ├── components/          # React components
│   │   ├── Cube/           # 3D cube rendering components
│   │   │   ├── KilominxRenderer.tsx
│   │   │   ├── FaceSelector.tsx
│   │   │   └── CubeControls.tsx
│   │   ├── UI/             # User interface components
│   │   │   ├── ColorPalette.tsx
│   │   │   ├── SolutionSteps.tsx
│   │   │   └── MobileControls.tsx
│   │   └── Layout/         # Layout components
│   ├── lib/                # Core logic and utilities
│   │   ├── kilominx/       # Kilominx-specific logic
│   │   │   ├── state.ts    # Cube state management
│   │   │   ├── solver.ts   # Solving algorithms
│   │   │   ├── moves.ts    # Move notation and execution
│   │   │   └── geometry.ts # Dodecahedron geometry
│   │   └── three/          # Three.js utilities
│   │       ├── scene.ts    # Scene setup
│   │       └── controls.ts # Camera controls
│   ├── pages/              # Next.js pages
│   ├── styles/             # Global styles
│   └── types/              # TypeScript type definitions
├── docs/                   # Documentation
│   ├── DEVELOPMENT.md      # Development guide
│   ├── ARCHITECTURE.md     # Technical architecture
│   ├── SOLVING_ALGORITHM.md # Algorithm explanation
│   └── API.md              # API documentation
├── tests/                  # Test files
└── public/                 # Static assets
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git for version control
- Modern web browser with WebGL support

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/kilominx-solver.git
   cd kilominx-solver
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
npm test             # Run tests
```

## 📖 Documentation

- **[Development Guide](docs/DEVELOPMENT.md)** - Setup and development workflow
- **[Architecture Overview](docs/ARCHITECTURE.md)** - Technical architecture details
- **[Solving Algorithm](docs/SOLVING_ALGORITHM.md)** - How the solver works
- **[API Reference](docs/API.md)** - Component and function documentation

## 🏗️ Development Phases

### Phase 1: Foundation ✅
- [x] Project setup and repository structure
- [x] Next.js + TypeScript configuration
- [x] Basic kilominx 3D model rendering
- [x] Camera controls and lighting

### Phase 2: User Interaction 🔄
- [ ] Face selection with ray casting
- [ ] Color palette UI
- [ ] Cube state management
- [ ] Mobile touch interactions

### Phase 3: Solving Algorithm 📋
- [ ] Kilominx state representation
- [ ] Layer-by-layer solving approach
- [ ] Move notation system
- [ ] Algorithm implementation

### Phase 4: Step-by-Step Instructions 📋
- [ ] Move animation system
- [ ] Instruction overlay
- [ ] Progress tracking
- [ ] Pause/resume functionality

### Phase 5: Polish & Optimization 📋
- [ ] Mobile optimization
- [ ] Performance improvements
- [ ] Error handling
- [ ] Final documentation

## 🎨 Color Scheme

The kilominx uses 12 distinct colors for its faces:
- White, Yellow, Dark Blue, Light Blue, Red, Pink
- Orange, Light Green, Dark Green, Purple, Grey, Dark Brown

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for my Cacanaka**