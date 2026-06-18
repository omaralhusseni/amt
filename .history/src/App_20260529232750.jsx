import { useEffect, useState } from "react";
import { Routes, Route, Navigate, Outlet, useNavigate } from "react-router-dom";
import LandingPage from "./components/LandingPage.jsx";
import ToursPage from "./components/ToursPage.jsx";
import TourDetailPage from "./components/TourDetailPage.jsx";
import BookingPage from "./components/BookingPage.jsx";

function Layout() {
  const [navScrolled, setNavScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-transparent`}
        style={{ paddingLeft: 'var(--page-pad)', paddingRight: 'var(--page-pad)', paddingTop: 20, paddingBottom: 20, ...(navScrolled ? { background: 'rgba(26,20,16,0.92)', backdropFilter: 'blur(12px)' } : {}) }}
      >
        <div className="font-serif text-lg uppercase tracking-widest text-amber-400 cursor-pointer" onClick={() => navigate("/")}>A · M · T · Tours</div>
        <div className="flex items-center gap-6">
          <span className="text-xs tracking-widest text-amber-100">en</span>
          <button className="border border-amber-400 text-amber-400 px-4 py-2 rounded" onClick={() => navigate("/tours")}>
            All Journeys →
          </button>
        </div>
      </nav>
      <div className="pt-24">
        <Outlet />
      </div>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path="tours" element={<ToursPage />} />
        <Route path="tours/:tourId" element={<TourDetailPage />} />
        <Route path="book/:tourId" element={<BookingPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
