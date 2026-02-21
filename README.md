# Web Quran App

A modern, fast, and responsive Al-Quran web application built with React, TypeScript, and Tailwind CSS. This application is designed to provide a premium reading and listening experience for users, especially for the Indonesian community.

## 🌟 Features

- **📖 114 Surahs**: Complete Quranic data with Arabic text, Latin transliteration, and Indonesian translation.
- **🎧 Per-Ayat Audio**: Listen to individual ayahs from 6 different Qaris (Default: Mishary Rashid Al-Afasy).
- **🔄 Auto-Scroll & Read Along**: The page automatically scrolls to the active ayah during audio playback, with real-time highlighting.
- **📌 Last Read Bookmark**: Automatically remembers your last read surah and ayah, so you can pick up where you left off.
- **❤️ Favorites**: Mark your most-read surahs as favorites for quick access from the sidebar.
- **🕌 Prayer Times (Jadwal Sholat)**: Accurate prayer schedule for over 517 cities in Indonesia, including Imsak, Subuh, Terbit, Dhuha, Dzuhur, Ashar, Maghrib, and Isya.
- **📱 Responsive Design**: Optimized for mobile, tablet, and desktop views with a sleek sticky bottom player.
- **🔍 Search & Filter**: Quickly find surahs by name, meaning, or revelation place.

## 🛠️ Technology Stack

- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Local Storage API** - Data Persistence

## 🔌 API Sources

This application uses data from the robust and stable [EQuran.id API v2](https://equran.id/apidev), which provides:

- Quranic text and Indonesian translations (Kemenag).
- Multi-reciter audio CDN.
- Official Indonesian Prayer Times data.

## 🚀 Getting Started

1. **Clone the repository**

   ```bash
   git clone [repository-url]
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```
