import { useState } from "react";

const Favorites = () => {
  // Initialize state from localStorage directly using a function
  const [favorites, setFavorites] = useState<number[]>(() => {
    const savedFavorites = localStorage.getItem("quranFavorites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  const handleRemoveFavorite = (surahNumber: number) => {
    const updatedFavorites = favorites.filter((num) => num !== surahNumber);
    setFavorites(updatedFavorites);
    localStorage.setItem("quranFavorites", JSON.stringify(updatedFavorites));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Favorite Surahs</h1>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No favorite surahs yet.</p>
          <p className="text-gray-500 mt-2">
            Go to the Surah page and click the favorite button to add surahs.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {favorites.map((surahNumber) => (
            <div
              key={surahNumber}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow border border-gray-200"
            >
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Surah {surahNumber}
                </h2>
                <p className="text-gray-600">Click to view details</p>
              </div>
              <button
                onClick={() => handleRemoveFavorite(surahNumber)}
                className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm hover:bg-red-200 transition-colors"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
