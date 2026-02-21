import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "quranFavorites";

/**
 * Custom hook for managing favorite surah IDs in localStorage.
 */
export const useFavorites = () => {
  const [favorites, setFavorites] = useState<number[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse favorites from localStorage", e);
      }
    }
  }, []);

  // Check if a surah is favorited
  const isFavorite = useCallback(
    (id: number) => {
      return favorites.includes(id);
    },
    [favorites],
  );

  // Toggle favorite status
  const toggleFavorite = useCallback((id: number) => {
    setFavorites((prev) => {
      const isFav = prev.includes(id);
      let updated;
      if (isFav) {
        updated = prev.filter((favId) => favId !== id);
      } else {
        updated = [...prev, id];
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return {
    favorites,
    isFavorite,
    toggleFavorite,
  };
};
