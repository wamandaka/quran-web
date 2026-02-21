import { Routes, Route } from "react-router";
import Home from "../pages/home";
import Surah from "../pages/surah";
import Favorites from "../pages/favorites";
import PrayerTimes from "../pages/prayer-times";
import Layout from "../layout/Layout";
const AppRouter = () => {
  return (
    // <div>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/surah/:nomor" element={<Surah />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/prayer-times" element={<PrayerTimes />} />
      </Route>
    </Routes>
    // </div>
  );
};

export default AppRouter;
