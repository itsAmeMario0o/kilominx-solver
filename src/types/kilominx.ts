/**
 * TypeScript definitions for the Kilominx Solver
 * 
 * This file defines all the core data structures used throughout the application:
 * - Face colors and cube state representation
 * - Move notation and execution
 * - 3D geometry and rendering data
 */

// ===== COLORS =====

/**
 * The 12 distinct colors used on a kilominx puzzle
 * Each color corresponds to one of the 12 pentagonal faces
 */
export enum FaceColor {
  WHITE = '#FFFFFF',
  YELLOW = '#FFFF00',
  DARK_BLUE = '#0000FF',
  LIGHT_BLUE = '#87CEEB',
  RED = '#FF0000',
  PINK = '#FFC0CB',
  ORANGE = '#FFA500',
  LIGHT_GREEN = '#90EE90',
  DARK_GREEN = '#006400',
  PURPLE = '#800080',
  GREY = '#808080',
  DARK_BROWN = '#8B4513',
}

/**
 * Array of all available face colors for easy iteration
 */
export const ALL_FACE_COLORS = Object.values(FaceColor);

// ===== 3D GEOMETRY =====

/**
 * 3D coordinate representation
 */
export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

/**
 * Represents a single pentagonal face on the kilominx
 */
export interface Face {
  /** Unique identifier for this face (0-61) */
  id: number;
  /** Current color of this face */
  color: FaceColor;
  /** 3D position of the face center */
  center: Vector3;
  /** Surface normal vector (points outward from center) */
  normal: Vector3;
  /** Array of vertex positions that form this pentagon */
  vertices: Vector3[];
  /** IDs of neighboring faces */
  neighbors: number[];
  /** Which major face this belongs to (0-11 for the 12 main faces) */
  majorFace: number;
  /** Ring position within the major face (0=center, 1=inner ring, 2=outer ring) */
  ring: number;
  /** Position within the ring */
  ringPosition: number;
}

/**
 * Complete geometric description of the kilominx
 */
export interface KilominxGeometry {
  /** All 62 faces of the kilominx */
  faces: Face[];
  /** Overall radius of the dodecahedron */
  radius: number;
  /** Scale factor for rendering */
  scale: number;
}

// ===== CUBE STATE =====

/**
 * Represents the current state of the entire kilominx
 */
export interface CubeState {
  /** Array of colors for each face (indexed by face ID) */
  faceColors: FaceColor[];
  /** Whether the cube is currently in a solved state */
  isSolved: boolean;
  /** Whether the current state is valid (solvable) */
  isValid: boolean;
  /** Hash string for quick state comparison */
  stateHash: string;
}

/**
 * Factory interface for creating different cube configurations
 */
export interface CubeStateFactory {
  /** Create a solved kilominx */
  createSolved(): CubeState;
  /** Create a scrambled kilominx */
  createScrambled(): CubeState;
  /** Create from a specific color array */
  createFromColors(colors: FaceColor[]): CubeState;
  /** Create from a state string */
  createFromString(stateString: string): CubeState;
}

// ===== MOVES AND ALGORITHMS =====

/**
 * Types of moves possible on a kilominx
 */
export enum MoveType {
  /** Clockwise rotation of a major face */
  FACE_CLOCKWISE = 'F',
  /** Counter-clockwise rotation of a major face */
  FACE_COUNTERCLOCKWISE = "F'",
  /** 180-degree rotation of a major face */
  FACE_DOUBLE = 'F2',
  /** Wide turn (affects multiple layers) */
  WIDE_CLOCKWISE = 'f',
  /** Wide counter-clockwise turn */
  WIDE_COUNTERCLOCKWISE = "f'",
  /** Wide double turn */
  WIDE_DOUBLE = 'f2',
}

/**
 * Represents a single move on the kilominx
 */
export interface Move {
  /** Type of move being performed */
  type: MoveType;
  /** Which major face to rotate (0-11) */
  face: number;
  /** Rotation angle in degrees (positive = clockwise) */
  angle: number;
  /** Array of face IDs that will be affected by this move */
  affectedFaces: number[];
  /** Human-readable notation (e.g., "R", "U'", "F2") */
  notation: string;
}

/**
 * A sequence of moves that forms an algorithm
 */
export interface Algorithm {
  /** Name of the algorithm */
  name: string;
  /** Description of what it accomplishes */
  description: string;
  /** Sequence of moves */
  moves: Move[];
  /** Category (e.g., "F2L", "OLL", "PLL") */
  category: string;
}

/**
 * Solution path from scrambled to solved state
 */
export interface Solution {
  /** Array of moves to solve the cube */
  moves: Move[];
  /** Number of moves in the solution */
  moveCount: number;
  /** Estimated time to execute (in milliseconds) */
  estimatedTime: number;
  /** Algorithm steps with descriptions */
  steps: SolutionStep[];
}

/**
 * Individual step in a solution with explanation
 */
export interface SolutionStep {
  /** Moves for this step */
  moves: Move[];
  /** Description of what this step accomplishes */
  description: string;
  /** Target state after this step */
  targetState: Partial<CubeState>;
}

// ===== SOLVING ENGINE =====

/**
 * Options for the solving algorithm
 */
export interface SolvingOptions {
  /** Maximum number of moves to search */
  maxMoves?: number;
  /** Timeout in milliseconds */
  timeout?: number;
  /** Whether to optimize for fewest moves */
  optimizeMoves?: boolean;
  /** Whether to return multiple solutions */
  findMultipleSolutions?: boolean;
}

/**
 * Result from a solving attempt
 */
export interface SolvingResult {
  /** Whether solving was successful */
  success: boolean;
  /** The solution (if successful) */
  solution?: Solution;
  /** Error message (if failed) */
  error?: string;
  /** Error code for programmatic handling */
  errorCode?: string;
  /** Time taken to solve (in milliseconds) */
  solvingTime: number;
}

// ===== USER INTERFACE =====

/**
 * State for the color selection UI
 */
export interface ColorPaletteState {
  /** Currently selected color */
  selectedColor: FaceColor;
  /** Whether the palette is visible */
  isVisible: boolean;
  /** Recently used colors */
  recentColors: FaceColor[];
}

/**
 * State for the 3D viewer
 */
export interface ViewerState {
  /** Camera position */
  cameraPosition: Vector3;
  /** Camera target (what it's looking at) */
  cameraTarget: Vector3;
  /** Zoom level */
  zoom: number;
  /** Whether auto-rotation is enabled */
  autoRotate: boolean;
  /** Currently selected face (for coloring) */
  selectedFace: number | null;
  /** Whether the cube is currently animating */
  isAnimating: boolean;
}

/**
 * Animation state for move execution
 */
export interface AnimationState {
  /** Whether an animation is currently playing */
  isPlaying: boolean;
  /** Current progress (0-1) */
  progress: number;
  /** Duration of current animation (ms) */
  duration: number;
  /** The move being animated */
  currentMove: Move | null;
  /** Queue of pending moves */
  moveQueue: Move[];
}

// ===== UTILITY TYPES =====

/**
 * Generic result type for operations that might fail
 */
export type Result<T, E = string> = {
  success: true;
  data: T;
} | {
  success: false;
  error: E;
};

/**
 * Event handler types for user interactions
 */
export interface KilominxEventHandlers {
  onFaceClick: (faceId: number) => void;
  onColorSelect: (color: FaceColor) => void;
  onSolveRequest: () => void;
  onMoveExecute: (move: Move) => void;
  onStateChange: (state: CubeState) => void;
}

/**
 * Configuration for the kilominx renderer
 */
export interface RendererConfig {
  /** Canvas dimensions */
  width: number;
  height: number;
  /** Whether to enable anti-aliasing */
  antialias: boolean;
  /** Whether to enable shadows */
  enableShadows: boolean;
  /** Background color */
  backgroundColor: string;
  /** Quality level (affects polygon count) */
  quality: 'low' | 'medium' | 'high';
  /** Whether to enable performance monitoring */
  enableStats: boolean;
}