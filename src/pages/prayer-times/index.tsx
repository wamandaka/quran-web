import React, { useState, useEffect } from "react";
import { capitalizeFirstLetter } from "../../utils/string";

interface Schedule {
  tanggal: string;
  tanggal_lengkap: string;
  hari: string;
  imsak: string;
  subuh: string;
  terbit: string;
  dhuha: string;
  dzuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
}

interface MonthlyData {
  provinsi: string;
  kabkota: string;
  bulan: number;
  tahun: number;
  bulan_nama: string;
  jadwal: Schedule[];
}

const PrayerTimes = () => {
  const [provinces, setProvinces] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>(
    localStorage.getItem("prayer_province") || "",
  );
  const [selectedCity, setSelectedCity] = useState<string>(
    localStorage.getItem("prayer_city") || "",
  );
  const [monthlySchedule, setMonthlySchedule] = useState<MonthlyData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  // Fetch Provinces
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const resp = await fetch("https://equran.id/api/v2/shalat/provinsi");
        const json = await resp.json();
        if (json.code === 200) {
          setProvinces(json.data);
          if (!selectedProvince && json.data.length > 0) {
            // Default to first province if none saved
            setSelectedProvince(json.data[0]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch provinces", err);
      }
    };
    fetchProvinces();
  }, []);

  // Fetch Cities when Province changes
  useEffect(() => {
    if (!selectedProvince) return;

    const fetchCities = async () => {
      try {
        const resp = await fetch("https://equran.id/api/v2/shalat/kabkota", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ provinsi: selectedProvince }),
        });
        const json = await resp.json();
        if (json.code === 200) {
          setCities(json.data);
          // If the saved city isn't in this province, reset it
          if (!json.data.includes(selectedCity)) {
            setSelectedCity(json.data[0]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch cities", err);
      }
    };
    fetchCities();
    localStorage.setItem("prayer_province", selectedProvince);
  }, [selectedProvince]);

  // Fetch Schedule when Province or City changes
  useEffect(() => {
    if (!selectedProvince || !selectedCity) return;

    const fetchSchedule = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const resp = await fetch("https://equran.id/api/v2/shalat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            provinsi: selectedProvince,
            kabkota: selectedCity,
            bulan: currentMonth,
            tahun: currentYear,
          }),
        });
        const json = await resp.json();
        if (json.code === 200) {
          setMonthlySchedule(json.data);
        } else {
          setError(json.message || "Failed to fetch schedule");
        }
      } catch (err) {
        setError("Network error. Please try again later.");
        console.error("Failed to fetch schedule", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSchedule();
    localStorage.setItem("prayer_city", selectedCity);
  }, [selectedProvince, selectedCity, currentMonth, currentYear]);

  const todaySchedule = monthlySchedule?.jadwal.find(
    (s) => parseInt(s.tanggal) === currentDay,
  );

  const prayerIcons: { [key: string]: React.ReactNode } = {
    imsak: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
    subuh: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
    terbit: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    ),
    dzuhur: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
    ashar: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
    maghrib: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
    ),
    isya: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
    ),
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Location Selector */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Jadwal Sholat</h1>
            <p className="text-gray-500 text-sm">
              Pilih lokasi Anda untuk mendapatkan jadwal yang akurat
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="appearance-none bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-3 pr-10 transition-all hover:bg-gray-100 cursor-pointer"
              >
                {provinces.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-400">
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
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            <div className="relative">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="appearance-none bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-3 pr-10 transition-all hover:bg-gray-100 cursor-pointer"
              >
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-400">
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
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl animate-pulse">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-medium">Memuat Jadwal Sholat...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl flex items-center gap-4">
          <svg
            className="w-6 h-6 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p>{error}</p>
        </div>
      ) : (
        <>
          {/* Today's Highlight */}
          {todaySchedule && (
            <div className="bg-linear-to-br from-blue-600 to-blue-700 rounded-3xl shadow-xl shadow-blue-200 p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-blue-400/20 rounded-full blur-2xl"></div>

              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                    <h2 className="text-4xl font-black mb-2 tracking-tight">
                      {todaySchedule.hari}, {currentDay}{" "}
                      {monthlySchedule?.bulan_nama} {currentYear}
                    </h2>
                    <div className="flex items-center gap-2 text-blue-100 font-medium">
                      <svg
                        className="w-5 h-5 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="text-lg">
                        {capitalizeFirstLetter(selectedCity)},{" "}
                        {selectedProvince}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 mt-10">
                  {[
                    "imsak",
                    "subuh",
                    "terbit",
                    "dhuha",
                    "dzuhur",
                    "ashar",
                    "maghrib",
                    "isya",
                  ].map((time) => (
                    <div
                      key={time}
                      className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 flex flex-col items-center hover:bg-white/20 transition-all cursor-default group"
                    >
                      <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-3 group-hover:text-white transition-colors">
                        {time}
                      </span>
                      <span className="text-2xl font-black mb-2">
                        {todaySchedule[time as keyof Schedule]}
                      </span>
                      <div className="text-blue-200 group-hover:scale-110 group-hover:text-white transition-all">
                        {prayerIcons[time]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Monthly Table */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">
                Jadwal Sebulan Penuh
              </h3>
              <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                {monthlySchedule?.bulan_nama} {currentYear}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Tanggal
                    </th>
                    {[
                      "imsak",
                      "subuh",
                      "terbit",
                      "dhuha",
                      "dzuhur",
                      "ashar",
                      "maghrib",
                      "isya",
                    ].map((t) => (
                      <th
                        key={t}
                        className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest"
                      >
                        {t}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {monthlySchedule?.jadwal.map((s) => (
                    <tr
                      key={s.tanggal}
                      className={`hover:bg-blue-50/50 transition-colors ${parseInt(s.tanggal) === currentDay ? "bg-blue-50/80" : ""}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span
                            className={`${parseInt(s.tanggal) === currentDay ? "text-blue-600 font-bold" : "text-gray-900 font-medium"}`}
                          >
                            {s.hari}, {s.tanggal}
                          </span>
                          {parseInt(s.tanggal) === currentDay && (
                            <span className="text-[10px] text-blue-500 font-black uppercase">
                              Hari Ini
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-700">
                        {s.imsak}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-700">
                        {s.subuh}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-700">
                        {s.terbit}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-700">
                        {s.dhuha}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-700">
                        {s.dzuhur}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-700">
                        {s.ashar}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-700">
                        {s.maghrib}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-700">
                        {s.isya}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PrayerTimes;
