import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const [visible, setVisible] = useState(false);
  const [destination, setDestination] = useState("Siwa");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [guests, setGuests] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  const handleExplore = (e) => {
    e?.preventDefault();
    const params = new URLSearchParams();
    if (destination) params.set("dest", destination);
    if (fromDate) params.set("from", fromDate);
    if (toDate) params.set("to", toDate);
    if (guests) params.set("guests", String(guests));
    navigate(`/tours?${params.toString()}`);
  };

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

        <form className={`landing-search ${visible ? "visible" : ""}`} onSubmit={handleExplore}>
          <div className="search-field">
            <label className="search-label">Destination</label>
            <input
              className="search-val"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. Siwa"
            />
          </div>
          <div className="search-divider" />
          <div className="search-field">
            <label className="search-label">From</label>
            <input
              className="search-val"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="search-divider" />
          <div className="search-field">
            <label className="search-label">To</label>
            <input
              className="search-val"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
          <div className="search-divider" />
          <div className="search-field">
            <label className="search-label">Guests</label>
            <input
              className="search-val"
              type="number"
              min="1"
              value={guests}
              onChange={(e) => setGuests(Math.max(1, Number(e.target.value) || 1))}
            />
          </div>
          <button className="search-cta" type="submit">Explore →</button>
        </form>
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
