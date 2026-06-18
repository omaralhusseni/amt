import { useEffect, useState } from "react";
import { Routes, Route, Navigate, Outlet, useNavigate } from "react-router-dom";
import LandingPage from "./components/LandingPage.jsx";
import ToursPage from "./components/ToursPage.jsx";
import TourDetailPage from "./components/TourDetailPage.jsx";
import BookingPage from "./components/BookingPage.jsx";
import CheckoutPage from "./components/CheckoutPage.jsx";
import PaymentConfirmationPage from "./components/PaymentConfirmationPage.jsx";
import PaymentSuccessPage from "./components/PaymentSuccessPage.jsx";
import PaymentErrorPage from "./components/PaymentErrorPage.jsx";
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
        <div className="nav-logo" onClick={() => navigate("/")}>
          A · M · T · Tours
        </div>
        <div className="nav-right">
          <span className="nav-lang">en</span>
          <button className="nav-btn" onClick={() => navigate("/tours")}>
            All Trips
          </button>
        </div>
      </nav>
      <div className="page-container">
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
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="payment-confirmation" element={<PaymentConfirmationPage />} />
        <Route path="payment-success" element={<PaymentSuccessPage />} />
        <Route path="payment-error" element={<PaymentErrorPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
