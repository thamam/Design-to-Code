import { useState, useCallback, useEffect } from 'react';
import { AppState, CodeMode, Language, DEFAULT_STATE } from '../types';
import { generateCode } from '../services/gemini';
import { useHistory } from './useHistory';
import { useDebouncedCallback } from 'use-debounce';

export function useAppStore() {
  const {
    state,
    setState,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useHistory<AppState>(() => {
    try {
      const saved = localStorage.getItem('appState');
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...parsed, isGenerating: false };
      }
      return DEFAULT_STATE;
    } catch (e) {
      console.error('Failed to parse appState from localStorage', e);
      return DEFAULT_STATE;
    }
  });

  // Auto-save to localStorage
  useEffect(() => {
    if (state.isDirty) {
      const timer = setTimeout(() => {
        localStorage.setItem('appState', JSON.stringify(state));
        setState({ ...state, isDirty: false });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [state, setState]);

  // Debounced history update for text changes to avoid too many history entries
  const debouncedUpdateText = useDebouncedCallback((text: string) => {
    setState({ ...state, designText: text, isDirty: true });
  }, 500);

  const updateState = useCallback((updates: Partial<AppState>) => {
    // If updating designText, handle it specially to avoid spamming history
    if ('designText' in updates && Object.keys(updates).length === 1) {
       // We update the current state immediately for UI responsiveness, 
       // but we might want to debounce the history push. 
       // However, useHistory as implemented pushes every setState.
       // To fix this, we would need a more complex history hook that supports "replace" vs "push".
       // For now, let's just update directly.
       setState({ ...state, ...updates, isDirty: true });
    } else {
       setState({ ...state, ...updates, isDirty: true });
    }
  }, [state, setState]);

  const handleTransform = useCallback(async () => {
    if (state.isGenerating) return;

    setState({ ...state, isGenerating: true, error: null });

    try {
      const newCode = await generateCode(
        state.designText,
        state.previousDesignText,
        state.generatedCode,
        state.codeMode,
        state.targetLanguage
      );

      setState({
        ...state,
        previousGeneratedCode: state.generatedCode,
        generatedCode: newCode,
        previousDesignText: state.designText,
        isGenerating: false,
        isDirty: true,
      });
    } catch (error) {
      setState({
        ...state,
        isGenerating: false,
        error: (error as Error).message,
      });
    }
  }, [state, setState]);

  const handleSave = useCallback(() => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'design-to-code.dtc.json';
    a.click();
    URL.revokeObjectURL(url);
    setState({ ...state, isDirty: false });
  }, [state, setState]);

  const handleLoad = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const loadedState = JSON.parse(e.target?.result as string);
            setState({ ...loadedState, isDirty: false });
          } catch (err) {
            console.error('Failed to load state:', err);
            alert('Failed to load state file.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, [setState]);

  const handleReset = useCallback(() => {
    const newState = {
      ...DEFAULT_STATE,
      isDirty: false,
    };
    localStorage.setItem('appState', JSON.stringify(newState));
    setState(newState);
  }, [setState]);

  return {
    state,
    updateState,
    handleTransform,
    handleSave,
    handleLoad,
    handleReset,
    undo,
    redo,
    canUndo,
    canRedo,
  };
}
