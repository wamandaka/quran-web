import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import { useFavorites } from "../../hooks/useFavorites";
import { useLastRead } from "../../hooks/useLastRead";
import { capitalizeFirstLetter } from "../../utils/string";
interface SurahDetail {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
  audioFull: { [key: string]: string };
}
const Surah = () => {
  const { nomor } = useParams();
  const [detailSurah, setDetailSurah] = useState<SurahDetail | null>(null);
  const [ayat, setAyat] = useState<
    Array<{
      nomorAyat: number;
      teksArab: string;
      teksLatin: string;
      teksIndonesia: string;
      audio: { [key: string]: string };
    }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isAutoScroll, setIsAutoScroll] = useState(false);
  const [activeAyah, setActiveAyah] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { isFavorite: checkIsFavorite, toggleFavorite: handleToggleFavorite } =
    useFavorites();
  const { lastRead, setLastRead } = useLastRead();
  const isFavorite = checkIsFavorite(parseInt(nomor || "0"));

  const ayahRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  useEffect(() => {
    // Fetch surah details using the nomor parameter
    const fetchSurahDetails = async () => {
      try {
        const resp = await fetch(`https://equran.id/api/v2/surat/${nomor}`);
        if (!resp.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await resp.json();
        if (result.data) {
          setDetailSurah(result.data);
          setAyat(result.data.ayat);
        }
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSurahDetails();
  }, [nomor]);

  useEffect(() => {
    // Scroll to last read ayah if this is the last read surah
    if (
      !isLoading &&
      lastRead &&
      lastRead.surahNomor === parseInt(nomor || "0")
    ) {
      const ayahElement = ayahRefs.current[lastRead.ayahNomor];
      if (ayahElement) {
        setTimeout(() => {
          ayahElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 500);
      }
    }
  }, [isLoading, lastRead, nomor]);

  useEffect(() => {
    // Scroll to active ayah when it changes in auto-scroll mode
    if (isAutoScroll && activeAyah) {
      const ayahElement = ayahRefs.current[activeAyah];
      if (ayahElement) {
        ayahElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [activeAyah, isAutoScroll]);

  // Audio event handlers
  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current
          .play()
          .catch((e) => console.error("Playback failed:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const playAyah = (nomorAyah: number) => {
    if (!detailSurah) return;

    // Set active ayah
    setActiveAyah(nomorAyah);
    setIsPlaying(true);

    // Find the ayah object to get its audio URL
    const targetAyah = ayat.find((a) => a.nomorAyat === nomorAyah);
    if (!targetAyah) return;

    // Use Alafasy ('05' in EQuran.id v2)
    const audioUrl = targetAyah.audio["05"];

    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play().catch((e) => {
        console.error(
          "Per-ayah playback failed, falling back to full surah audio",
          e,
        );
        // Fallback or handle error
      });
    }
  };

  const handleAudioEnded = () => {
    if (isAutoScroll && activeAyah && detailSurah) {
      if (activeAyah < detailSurah.jumlahAyat) {
        // Play next ayah
        playAyah(activeAyah + 1);
      } else {
        // End of surah
        setIsPlaying(false);
        setActiveAyah(null);
      }
    } else {
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const toggleFavorite = () => {
    handleToggleFavorite(parseInt(nomor || "0"));
  };

  const handleMarkLastRead = (ayahNomor: number) => {
    if (detailSurah) {
      setLastRead({
        surahNomor: detailSurah.nomor,
        surahName: detailSurah.namaLatin,
        ayahNomor: ayahNomor,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {detailSurah ? (
        <div className="space-y-6">
          {/* Surah Header */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {detailSurah.namaLatin}
                </h1>
                <p className="text-gray-600 mt-1">{detailSurah.nama}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {detailSurah.jumlahAyat} verses
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Revealed in {capitalizeFirstLetter(detailSurah.tempatTurun)}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                    Surah #{detailSurah.nomor}
                  </span>
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex items-center space-x-4">
                <button
                  onClick={toggleFavorite}
                  className={`flex items-center justify-center w-12 h-12 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
                    isFavorite
                      ? "bg-yellow-400 text-yellow-900"
                      : "bg-gray-100 text-gray-600"
                  }`}
                  aria-label={
                    isFavorite ? "Remove from favorites" : "Add to favorites"
                  }
                >
                  <svg
                    className="w-6 h-6"
                    fill={isFavorite ? "currentColor" : "none"}
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
                <button
                  onClick={handlePlayPause}
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label={isPlaying ? "Pause audio" : "Play audio"}
                >
                  {isPlaying ? (
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Surah Description */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Description
            </h2>
            <p
              className="text-gray-700"
              dangerouslySetInnerHTML={{ __html: detailSurah.deskripsi }}
            ></p>
          </div>

          {/* Surah Translation */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Translation
            </h2>
            <p
              className="text-gray-700"
              dangerouslySetInnerHTML={{ __html: detailSurah.arti }}
            ></p>
          </div>

          {/* Ayat Surah */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Verses</h2>
            {ayat.length > 0 ? (
              <div className="space-y-6">
                {ayat.map((item) => (
                  <div
                    key={item.nomorAyat}
                    ref={(el) => {
                      ayahRefs.current[item.nomorAyat] = el;
                    }}
                    className={`border-b border-gray-200 pb-6 last:border-0 rounded-lg transition-all duration-300 ${
                      activeAyah === item.nomorAyat
                        ? "bg-blue-100 ring-2 ring-blue-400"
                        : lastRead?.surahNomor === detailSurah.nomor &&
                            lastRead?.ayahNomor === item.nomorAyat
                          ? "bg-blue-50"
                          : ""
                    }`}
                  >
                    <div className="flex items-start p-4">
                      <div className="shrink-0 flex flex-col items-center mr-4 mt-1 space-y-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                          {item.nomorAyat}
                        </div>
                        <div className="flex flex-col space-y-2">
                          <button
                            onClick={() => handleMarkLastRead(item.nomorAyat)}
                            className={`p-1.5 rounded-full transition-colors ${
                              lastRead?.surahNomor === detailSurah.nomor &&
                              lastRead?.ayahNomor === item.nomorAyat
                                ? "text-blue-600 bg-blue-100"
                                : "text-gray-400 hover:bg-gray-100"
                            }`}
                            title="Mark as last read"
                          >
                            <svg
                              className="w-5 h-5"
                              fill={
                                lastRead?.surahNomor === detailSurah.nomor &&
                                lastRead?.ayahNomor === item.nomorAyat
                                  ? "currentColor"
                                  : "none"
                              }
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => {
                              setIsAutoScroll(true);
                              playAyah(item.nomorAyat);
                            }}
                            className={`p-1.5 rounded-full transition-colors ${
                              activeAyah === item.nomorAyat
                                ? "text-green-600 bg-green-100"
                                : "text-gray-400 hover:bg-gray-100"
                            }`}
                            title="Play this ayah"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="text-3xl text-right font-arabic mb-4 leading-loose">
                          {item.teksArab}
                        </div>
                        <div
                          className="text-gray-700 mb-2 text-lg"
                          dangerouslySetInnerHTML={{ __html: item.teksLatin }}
                        >
                          {/* Content rendered via dangerouslySetInnerHTML */}
                        </div>
                        <div className="text-gray-600 text-base">
                          {item.teksIndonesia}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No verses available for this surah
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">Surah details not available</p>
        </div>
      )}
      {/* Sticky Bottom Audio Player */}
      {detailSurah && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 lg:pl-68">
          <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-md border border-gray-200 shadow-2xl rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
            <audio
              ref={audioRef}
              src={detailSurah.audioFull["05"]}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={handleAudioEnded}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />

            <div className="flex items-center gap-4 w-full sm:w-auto">
              <button
                onClick={handlePlayPause}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all active:scale-90 shadow-lg shadow-blue-200"
                aria-label={isPlaying ? "Pause audio" : "Play audio"}
              >
                {isPlaying ? (
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>

              <div className="flex-1 sm:hidden">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            </div>

            <div className="hidden sm:flex flex-col flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-gray-900 truncate uppercase tracking-wider">
                  {detailSurah.namaLatin}{" "}
                  {activeAyah ? `— Ayat ${activeAyah}` : "(Full Surah)"}
                </span>
                <span className="text-xs font-medium text-gray-500">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  const newMode = !isAutoScroll;
                  setIsAutoScroll(newMode);
                  if (newMode && !activeAyah) {
                    playAyah(1);
                  } else if (!newMode) {
                    if (audioRef.current) {
                      audioRef.current.src = detailSurah.audioFull["05"];
                      setIsPlaying(false);
                      setActiveAyah(null);
                    }
                  }
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  isAutoScroll
                    ? "bg-green-100 text-green-700 ring-2 ring-green-500/20"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                  />
                </svg>
                {isAutoScroll ? "Auto-Scroll ON" : "Auto-Scroll OFF"}
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="h-24"></div> {/* Spacer for fixed bottom player */}
    </div>
  );
};

export default Surah;
