import { useEffect, useState, useMemo } from "react";
import { NavLink } from "react-router";
import { useFavorites } from "../../hooks/useFavorites";
import { useLastRead } from "../../hooks/useLastRead";
import { capitalizeFirstLetter } from "../../utils/string";
interface Surah {
  nomor: number;
  nama: string;
  nama_latin: string;
  jumlah_ayat: number;
  tempat_turun: string;
  arti: string;
  deskripsi: string;
  audio: string;
}
function Home() {
  const [surah, setSurah] = useState<Surah[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPlace, setFilterPlace] = useState("all");
  const [sortBy, setSortBy] = useState("nomor");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { lastRead } = useLastRead();

  useEffect(() => {
    let isSubscribed = true;
    const fetchSurah = async () => {
      try {
        const resp = await fetch(
          "https://quran-api.santrikoding.com/api/surah",
        );
        if (!resp.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await resp.json();
        console.log(data);
        if (isSubscribed) {
          setSurah(data);
        }
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSurah();
    return () => {
      isSubscribed = false;
      console.log("component unmounted subscription clean up");
    };
  }, []);

  // Filter and sort surah data
  const filteredAndSortedSurah = useMemo(() => {
    let result = [...surah];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.nama_latin.toLowerCase().includes(term) ||
          item.arti.toLowerCase().includes(term) ||
          item.nama.toLowerCase().includes(term),
      );
    }

    // Apply place filter
    if (filterPlace !== "all") {
      result = result.filter((item) => item.tempat_turun === filterPlace);
    }

    // Apply favorites filter
    if (showFavoritesOnly) {
      result = result.filter((item) => isFavorite(item.nomor));
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === "nomor") {
        return a.nomor - b.nomor;
      } else if (sortBy === "name") {
        return a.nama_latin.localeCompare(b.nama_latin);
      } else if (sortBy === "verses") {
        return b.jumlah_ayat - a.jumlah_ayat;
      }
      return 0;
    });

    return result;
  }, [surah, searchTerm, filterPlace, sortBy, showFavoritesOnly, isFavorite]);

  // Get unique places for filter dropdown
  const uniquePlaces = useMemo(() => {
    const places = new Set(surah.map((item) => item.tempat_turun));
    // Custom sort: 'mekah' before 'madinah'
    return Array.from(places).sort((a, b) => {
      if (a.toLowerCase() === "mekah") return -1;
      if (b.toLowerCase() === "mekah") return 1;
      return a.localeCompare(b);
    });
  }, [surah]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {lastRead && (
        <div className="mb-6 p-6 bg-blue-600 rounded-lg shadow-lg text-white flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-xl font-bold mb-1">Terakhir Baca</h2>
            <p className="opacity-90">
              Surah {lastRead.surahName}, Ayat {lastRead.ayahNomor}
            </p>
          </div>
          <NavLink
            to={`/surah/${lastRead.surahNomor}`}
            className="px-6 py-2 bg-white text-blue-600 font-semibold rounded-full hover:bg-blue-50 transition-colors"
          >
            Lanjutkan Membaca
          </NavLink>
        </div>
      )}

      <div className="mb-6 p-4 bg-white rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Search Surah
            </label>
            <input
              type="text"
              id="search"
              placeholder="Search by name, translation..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="place"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Revelation Place
            </label>
            <div className="flex gap-2">
              <select
                id="place"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={filterPlace}
                onChange={(e) => setFilterPlace(e.target.value)}
              >
                <option value="all">All Places</option>
                {uniquePlaces.map((place) => (
                  <option key={place} value={place}>
                    {capitalizeFirstLetter(place)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="sort"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Sort & Filter
            </label>
            <div className="flex gap-2">
              <select
                id="sort"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="nomor">Surah Number</option>
                <option value="name">Surah Name</option>
                <option value="verses">Number of Verses</option>
              </select>
              <button
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={`px-3 py-2 border rounded-md shadow-sm transition-colors flex items-center gap-1 ${
                  showFavoritesOnly
                    ? "bg-yellow-400 border-yellow-500 text-yellow-900"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
                title={showFavoritesOnly ? "Show All" : "Show Favorites"}
              >
                <svg
                  className="w-5 h-5"
                  fill={showFavoritesOnly ? "currentColor" : "none"}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span className="hidden sm:inline">Favorites</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredAndSortedSurah.map((item) => (
          <NavLink to={`/surah/${item.nomor}`} key={item.nomor}>
            <article className="relative rounded-lg border border-gray-100 bg-white p-4 shadow-xs transition hover:shadow-lg sm:p-6">
              <div className="flex justify-between items-start mb-4">
                <span className="inline-block rounded-full bg-blue-600 p-2 w-10 h-10 text-center text-white">
                  <p>{item.nomor}</p>
                </span>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFavorite(item.nomor);
                  }}
                  className={`p-2 rounded-full transition-colors ${
                    isFavorite(item.nomor)
                      ? "text-yellow-500 hover:bg-yellow-50"
                      : "text-gray-400 hover:bg-gray-100"
                  }`}
                  aria-label={
                    isFavorite(item.nomor)
                      ? "Remove from favorites"
                      : "Add to favorites"
                  }
                >
                  <svg
                    className="w-6 h-6"
                    fill={isFavorite(item.nomor) ? "currentColor" : "none"}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>

              <div>
                <h3 className="mt-0.5 text-lg font-medium text-gray-900">
                  {item.nama_latin}
                </h3>
                <p className="mt-1 text-sm text-gray-700">{item.arti}</p>
                <p className="mt-1 text-xs text-gray-500">
                  Revealed in {capitalizeFirstLetter(item.tempat_turun)}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {item.jumlah_ayat} verses
                </p>
              </div>
            </article>
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default Home;
