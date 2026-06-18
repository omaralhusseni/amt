import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DeckCard from "./DeckCard.jsx";
import { tours, getCardStyle } from "../toursData.js";

export default function ToursPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);
  const scrollAccum = useRef(0);
  const navigate = useNavigate();

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
          <div className="date-input">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            11/07/2026
          </div>
          <div className="date-input">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            25/07/2026
          </div>
          <div className="date-input">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
            </svg>
            1
          </div>
        </div>
      </div>

      <div ref={containerRef} className="deck-container">
        {[...tours].reverse().map((tour, ri) => {
          const originalIndex = tours.length - 1 - ri;
          const style = getCardStyle(originalIndex, currentIndex, tours.length);
          return (
            <DeckCard
              key={tour.id}
              tour={tour}
              style={style}
              onSelect={() => navigate(`/tours/${tour.id}`)}
            />
          );
        })}
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
