import { useEffect, useState } from "react";
import { Routes, Route, Navigate, Outlet, useNavigate } from "react-router-dom";
import LandingPage from "./components/LandingPage.jsx";
import ToursPage from "./components/ToursPage.jsx";
import TourDetailPage from "./components/TourDetailPage.jsx";
import BookingPage from "./components/BookingPage.jsx";
import "./egypt-tours.css";

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
      <nav className={`nav ${navScrolled ? "scrolled" : ""}`}>
        <div className="nav-logo mt-100" onClick={() => navigate("/")}>
          A · M · T · Tours
        </div>
        <div className="nav-right">
          <span className="nav-lang">en</span>
          <button className="nav-btn" onClick={() => navigate("/tours")}>
            All Journeys →
          </button>
        </div>
      </nav>
      <div className="page-container mt-10">
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
