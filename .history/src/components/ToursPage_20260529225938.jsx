import { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DeckCard from "./DeckCard.jsx";
import { tours, getCardStyle } from "../toursData.js";

export default function ToursPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);
  const scrollAccum = useRef(0);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [destination, setDestination] = useState(searchParams.get("dest") || "");
  const [from, setFrom] = useState(searchParams.get("from") || "");
  const [to, setTo] = useState(searchParams.get("to") || "");
  const [guests, setGuests] = useState(searchParams.get("guests") || "1");

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      const rect = el.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
      if (!inView) return;

      scrollAccum.current += e.deltaY;
      if (scrollAccum.current > 80) {
        scrollAccum.current = 0;
        setCurrentIndex((value) => (value + 1) % tours.length);
        e.preventDefault();
      } else if (scrollAccum.current < -80) {
        scrollAccum.current = 0;
        setCurrentIndex((value) => (value - 1 + tours.length) % tours.length);
        e.preventDefault();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  // keep currentIndex valid when filtered set changes
  useEffect(() => {
    const filtered = tours.filter((t) => {
      if (destination && !`${t.name} ${t.subtitle}`.toLowerCase().includes(destination.toLowerCase())) return false;
      return true;
    });
    if (filtered.length === 0) {
      setCurrentIndex(0);
    } else if (currentIndex >= filtered.length) {
      setCurrentIndex(0);
    }
  }, [destination, from, to, guests]);

  return (
    <section className="tours-page page" id="tours">
      <div className="tours-header fade-up fade-up-1">
        <div>
          <h2 className="tours-heading">
            Our <span>Journeys</span>
          </h2>
          <p style={{ marginTop: 12, fontSize: "0.8rem", color: "var(--text-muted)", letterSpacing: "0.05em" }}>
            Scroll through our curated collection
          </p>
        </div>
        <div className="filter-bar">
          <div className="date-input" style={{ minWidth: 160 }}>
            <label className="search-label">Destination</label>
            <input className="booking-input" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="e.g. Siwa" />
          </div>
          <div className="date-input">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <input className="booking-input" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div className="date-input">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <input className="booking-input" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          <div className="date-input">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
            </svg>
            <input className="booking-input" type="number" min="1" value={guests} onChange={(e) => setGuests(e.target.value)} />
          </div>
          <div className="filter-actions">
            <button className="nav-btn" onClick={() => {
              const params = new URLSearchParams();
              if (destination) params.set("dest", destination);
              if (from) params.set("from", from);
              if (to) params.set("to", to);
              if (guests) params.set("guests", guests);
              navigate(`/tours?${params.toString()}`);
            }}>Apply</button>
          </div>
        </div>
      </div>

      <div ref={containerRef} className="deck-container">
        {(() => {
          const filtered = tours.filter((t) => {
            if (destination && !`${t.name} ${t.subtitle}`.toLowerCase().includes(destination.toLowerCase())) return false;
            return true;
          });

          if (filtered.length === 0) {
            return <div style={{ padding: 40, textAlign: "center", color: "var(--dark)" }}>No journeys match your filters.</div>;
          }

          return [...filtered].reverse().map((tour, ri) => {
            const originalIndex = filtered.length - 1 - ri;
            const style = getCardStyle(originalIndex, currentIndex, filtered.length);
            return (
              <DeckCard
                key={tour.id}
                tour={tour}
                style={style}
                index={originalIndex}
                total={filtered.length}
                onSelect={() => navigate(`/tours/${tour.id}`)}
              />
            );
          });
        })()}
      </div>

      <div className="deck-dots">
        {tours.map((_, i) => (
          <div
            key={i}
            className={`deck-dot ${i === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(i)}
          />
        ))}
      </div>

      <div className="deck-hint">↓ Scroll to browse the collection ↑</div>
    </section>
  );
}
