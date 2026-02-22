import { useState, useEffect, useRef } from 'react';
import { AppState } from '../types';

interface AutoTriggerProps {
  state: AppState;
  onTrigger: () => void;
}

export function useAutoTrigger({ state, onTrigger }: AutoTriggerProps) {
  const [lastChangeTime, setLastChangeTime] = useState<number>(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Reset timer on text change
    setLastChangeTime(Date.now());
    
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (!state.autoMode || state.isGenerating) {
      return;
    }

    // Check if text has changed significantly since last generation
    if (state.designText === state.previousDesignText) {
      return;
    }

    // Check for completeness heuristic
    const text = state.designText.trim();
    if (!text) return;
    
    const lastChar = text.slice(-1);
    const isComplete = ['.', ':', ')', ']', '}', '\n'].includes(lastChar) || text.endsWith('\n');

    if (!isComplete) {
      return;
    }

    // Set idle timer (2 seconds)
    timerRef.current = setTimeout(() => {
      onTrigger();
    }, 2000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [state.designText, state.autoMode, state.isGenerating, state.previousDesignText, onTrigger]);
}
