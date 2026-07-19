// Session types for the Vintage Photo Booth app

export type ColorMode = 'color' | 'monochrome' | 'retro';
export type IntervalSeconds = 2 | 3 | 5 | 8;
export type SessionPhase = 'landing' | 'settings' | 'capture' | 'result';
export type PhotoCount = 2 | 3 | 4 | 6;
/** Tracks the direction of navigation so components can use the right entrance animation */
export type NavState = 'entering-booth' | 'exiting-booth' | null;

/**
 * StripStyle controls the photo strip background:
 * - 'white'  : classic white strip
 * - 'black'  : dark/moody strip with light timestamp text
 * - 'film'   : no background — photos touching each other (timestamp disabled)
 */
export type StripStyle = 'white' | 'black' | 'film';

export interface BoothSettings {
  colorMode: ColorMode;
  interval: IntervalSeconds;
  showCountdown: boolean;
  showTimestamp: boolean;
  photoCount: PhotoCount;
  stripStyle: StripStyle;
  /** Whether the strip container and individual photos have rounded corners */
  roundedEdges: boolean;
}

export interface SessionState {
  phase: SessionPhase;
  navState: NavState;
  settings: BoothSettings;
  capturedPhotos: string[];       // base64 data URLs
  generatedStrip: string | null;  // base64 PNG data URL
  cameraPermission: 'idle' | 'granted' | 'denied';
  currentPhotoIndex: number;
  currentCountdown: number;
  isCapturing: boolean;
  isGeneratingStrip: boolean;
}

export interface SessionActions {
  startSession: () => void;       // settings → capture
  endSession: () => void;         // capture → result
  goSettings: () => void;         // landing/result → settings (new session)
  goLanding: () => void;          // anywhere → landing with exit-booth animation
  updateSettings: (settings: Partial<BoothSettings>) => void;
  addPhoto: (dataUrl: string) => void;
  setGeneratedStrip: (strip: string) => void;
  setCameraPermission: (status: 'idle' | 'granted' | 'denied') => void;
  setCurrentCountdown: (n: number) => void;
  setCurrentPhotoIndex: (n: number) => void;
  setIsCapturing: (v: boolean) => void;
  setIsGeneratingStrip: (v: boolean) => void;
  resetPhotos: () => void;
  setNavState: (state: NavState) => void;
}
