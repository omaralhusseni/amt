import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <section className="landing page">
      <div className="landing-bg" />
      <div className="landing-content">
        <div className={`landing-eyebrow ${visible ? "visible" : ""}`}>
          Egypt as a local, not a tourist
        </div>
        <h1 className={`landing-headline ${visible ? "visible" : ""}`}>
          You only<br />think you<br /><em>know Egypt</em>
        </h1>
        <div className={`gold-line ${visible ? "fade-up fade-up-3" : ""}`} />
        <p className={`landing-sub ${visible ? "visible" : ""}`}>
          Curated journeys into the Egypt that doesn't appear in guidebooks.
          Sacred, silent, and entirely yours.
        </p>
        <div className={`landing-search ${visible ? "visible" : ""}`}>
          <div className="search-field">
            <span className="search-label">Destination</span>
            <span className="search-val">Siwa</span>
          </div>
          <div className="search-divider" />
          <div className="search-field">
            <span className="search-label">From</span>
            <span className="search-val">dd/mm/yyyy</span>
          </div>
          <div className="search-divider" />
          <div className="search-field">
            <span className="search-label">To</span>
            <span className="search-val">dd/mm/yyyy</span>
          </div>
          <div className="search-divider" />
          <div className="search-field">
            <span className="search-label">Guests</span>
            <span className="search-val">1</span>
          </div>
          <button className="search-cta" onClick={() => navigate("/tours")}>Explore →</button>
        </div>
      </div>
      <div className={`landing-caption ${visible ? "visible" : ""}`}>
        A.M.T. Tours — Since 1997
      </div>
      <div className={`landing-scroll-hint ${visible ? "visible" : ""}`}>
        <div className="scroll-line" />
        <span className="scroll-text">Scroll</span>
      </div>
    </section>
  );
}
