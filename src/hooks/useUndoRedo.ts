
import { useState, useCallback, useRef } from 'react';

interface UndoRedoState<T> {
  current: T;
  history: T[];
  historyIndex: number;
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  push: (newState: T) => void;
  reset: (initialState: T) => void;
}

export function useUndoRedo<T>(initialState: T, maxHistorySize: number = 50): UndoRedoState<T> {
  const [history, setHistory] = useState<T[]>([initialState]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
    }
  }, [historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
    }
  }, [historyIndex, history.length]);

  const push = useCallback((newState: T) => {
    // Remove any future history if we're not at the end
    const newHistory = history.slice(0, historyIndex + 1);
    
    // Add the new state
    newHistory.push(newState);
    
    // Limit history size
    if (newHistory.length > maxHistorySize) {
      newHistory.shift();
      setHistoryIndex(newHistory.length - 1);
    } else {
      setHistoryIndex(newHistory.length - 1);
    }
    
    setHistory(newHistory);
  }, [history, historyIndex, maxHistorySize]);

  const reset = useCallback((newInitialState: T) => {
    setHistory([newInitialState]);
    setHistoryIndex(0);
  }, []);

  return {
    current: history[historyIndex],
    history,
    historyIndex,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    undo,
    redo,
    push,
    reset
  };
}
