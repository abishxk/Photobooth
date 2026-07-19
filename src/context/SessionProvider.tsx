import React, { createContext, useContext, useState, useCallback } from 'react';
import type {
  SessionState,
  SessionActions,
  BoothSettings,
  NavState,
} from '../types';

const DEFAULT_SETTINGS: BoothSettings = {
  colorMode: 'color',
  interval: 3,
  showCountdown: true,
  showTimestamp: false,
  photoCount: 4,
  stripStyle: 'white',
  roundedEdges: true,
};

const DEFAULT_STATE: SessionState = {
  phase: 'landing',
  navState: null,
  settings: DEFAULT_SETTINGS,
  capturedPhotos: [],
  generatedStrip: null,
  cameraPermission: 'idle',
  currentPhotoIndex: 0,
  currentCountdown: 0,
  isCapturing: false,
  isGeneratingStrip: false,
};

type SessionContextType = SessionState & SessionActions;

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SessionState>(DEFAULT_STATE);

  const updateState = useCallback((partial: Partial<SessionState>) => {
    setState(prev => ({ ...prev, ...partial }));
  }, []);

  /** settings → capture */
  const startSession = useCallback(() => {
    setState(prev => ({
      ...prev,
      phase: 'capture',
      capturedPhotos: [],
      generatedStrip: null,
      currentPhotoIndex: 0,
      isCapturing: false,
      isGeneratingStrip: false,
      cameraPermission: 'idle',
    }));
  }, []);

  /** capture → result */
  const endSession = useCallback(() => {
    updateState({ phase: 'result' });
  }, [updateState]);

  /**
   * Go to the settings screen.
   * Called when: landing → (tap booth) → settings,
   * or result → (new session) → settings.
   */
  const goSettings = useCallback(() => {
    setState(prev => ({
      ...prev,
      phase: 'settings',
      navState: null,
      capturedPhotos: [],
      generatedStrip: null,
      currentPhotoIndex: 0,
      isCapturing: false,
      isGeneratingStrip: false,
      cameraPermission: 'idle',
    }));
  }, []);

  /**
   * Return to the landing page (lobby) — plays exit-booth zoom animation.
   * Called when: result → (exit photo booth) → landing.
   */
  const goLanding = useCallback(() => {
    setState({
      ...DEFAULT_STATE,
      phase: 'landing',
      navState: 'exiting-booth',
      // preserve settings so returning users don't lose them
      settings: state.settings,
    });
  }, [state.settings]);

  const setNavState = useCallback((ns: NavState) => {
    updateState({ navState: ns });
  }, [updateState]);

  const updateSettings = useCallback((settings: Partial<BoothSettings>) => {
    setState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...settings },
    }));
  }, []);

  const addPhoto = useCallback((dataUrl: string) => {
    setState(prev => ({
      ...prev,
      capturedPhotos: [...prev.capturedPhotos, dataUrl],
      currentPhotoIndex: prev.currentPhotoIndex + 1,
    }));
  }, []);

  const setGeneratedStrip = useCallback((strip: string) => {
    updateState({ generatedStrip: strip });
  }, [updateState]);

  const setCameraPermission = useCallback((status: 'idle' | 'granted' | 'denied') => {
    updateState({ cameraPermission: status });
  }, [updateState]);

  const setCurrentCountdown = useCallback((n: number) => {
    updateState({ currentCountdown: n });
  }, [updateState]);

  const setCurrentPhotoIndex = useCallback((n: number) => {
    updateState({ currentPhotoIndex: n });
  }, [updateState]);

  const setIsCapturing = useCallback((v: boolean) => {
    updateState({ isCapturing: v });
  }, [updateState]);

  const setIsGeneratingStrip = useCallback((v: boolean) => {
    updateState({ isGeneratingStrip: v });
  }, [updateState]);

  const resetPhotos = useCallback(() => {
    updateState({ capturedPhotos: [], currentPhotoIndex: 0 });
  }, [updateState]);

  const value: SessionContextType = {
    ...state,
    startSession,
    endSession,
    goSettings,
    goLanding,
    setNavState,
    updateSettings,
    addPhoto,
    setGeneratedStrip,
    setCameraPermission,
    setCurrentCountdown,
    setCurrentPhotoIndex,
    setIsCapturing,
    setIsGeneratingStrip,
    resetPhotos,
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionContextType {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within SessionProvider');
  return ctx;
}
