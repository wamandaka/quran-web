import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "quranLastRead";

export interface LastReadData {
  surahNomor: number;
  surahName: string;
  ayahNomor: number;
}

/**
 * Custom hook for managing the last read position in localStorage.
 */
export const useLastRead = () => {
  const [lastRead, setLastReadState] = useState<LastReadData | null>(null);

  // Load last read from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setLastReadState(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse last read from localStorage", e);
      }
    }
  }, []);

  // Update last read position
  const setLastRead = useCallback((data: LastReadData) => {
    setLastReadState(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, []);

  // Clear last read position
  const clearLastRead = useCallback(() => {
    setLastReadState(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    lastRead,
    setLastRead,
    clearLastRead,
  };
};
