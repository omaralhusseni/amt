import { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DeckCard from "./DeckCard.jsx";
import DestinationSelect from "./DestinationSelect.jsx";
import { tours, getCardStyle } from "../toursData.js";

export default function ToursPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);
  const scrollAccum = useRef(0);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // removed single destination input; use multi-select `selectedDestinations` below
  const [from, setFrom] = useState(searchParams.get("from") || "");
  const [to, setTo] = useState(searchParams.get("to") || "");
  const [guests, setGuests] = useState(searchParams.get("guests") || "1");

  // destinations multi-select: parse comma-separated `dest` param
  const initialDest = searchParams.get("dest") || "";
  const initialSelected = initialDest ? initialDest.split(",").map((s) => s.trim()).filter(Boolean) : [];
  const [selectedDestinations, setSelectedDestinations] = useState(initialSelected);
  const DEST_OPTIONS = ['Siwa','Hurghada','Cairo','Sharm el Sheikh','Dahab','Nuweiba','Luxor','Aswan','Nuba','Alexandria'];

  const filteredTours = useMemo(() => {
    const fFrom = from ? new Date(from) : null;
    const fTo = to ? new Date(to) : null;
    const normalize = (d) => {
      const x = new Date(d);
      x.setHours(0, 0, 0, 0);
      return x;
    };
    const nfFrom = fFrom ? normalize(fFrom) : null;
    const nfTo = fTo ? normalize(fTo) : null;

    return tours.filter((t) => {
      // destination match (multi-select)
      if (selectedDestinations && selectedDestinations.length > 0) {
        const hay = `${t.name} ${t.subtitle}`.toLowerCase();
        const matches = selectedDestinations.some((d) => hay.includes(d.toLowerCase()));
        if (!matches) return false;
      }

      // date range match against availableDates (if provided)
      if (fFrom || fTo) {
        const dates = t.availableDates || [];
        // if a tour doesn't list specific dates, treat it as 'any-date' and include it
        if (dates.length === 0) return true;

        const hasMatch = dates.some((d) => {
          const dt = normalize(d);
          if (nfFrom && dt < nfFrom) return false;
          if (nfTo && dt > nfTo) return false;
          return true;
        });
        if (!hasMatch) return false;
      }

      // guest count not currently limiting tours (could add capacity later)
      return true;
    });
  }, [selectedDestinations, from, to, guests]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      const rect = el.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
      if (!inView) return;

      // prevent page scroll immediately for any wheel over the deck
      e.preventDefault();
      e.stopPropagation();

      scrollAccum.current += e.deltaY;
      if (scrollAccum.current > 80) {
        scrollAccum.current = 0;
        setCurrentIndex((value) => (value + 1) % Math.max(1, filteredTours.length));
      } else if (scrollAccum.current < -80) {
        scrollAccum.current = 0;
        setCurrentIndex((value) => (value - 1 + Math.max(1, filteredTours.length)) % Math.max(1, filteredTours.length));
      }
    };

    // attach listener to the deck element so it only fires while pointer is over it
    el.addEventListener("wheel", handleWheel, { passive: false });

    // also block touchmove to avoid page scrolling on touch while interacting
    const handleTouchMove = (e) => {
      const rect = el.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
      if (!inView) return;
      e.preventDefault();
      e.stopPropagation();
    };
    el.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      el.removeEventListener("wheel", handleWheel);
      el.removeEventListener("touchmove", handleTouchMove);
    };
  }, [filteredTours]);

  // keep currentIndex valid when filtered set changes
  useEffect(() => {
    if (filteredTours.length === 0) {
      setCurrentIndex(0);
    } else if (currentIndex >= filteredTours.length) {
      setCurrentIndex(0);
    }
  }, [filteredTours]);

  return (
    <section className="bg-white/80 min-h-screen" id="tours">
      <div className="max-w-7xl mx-auto px-6 md:px-20 py-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-4xl font-serif text-gray-900">Our <span className="text-yellow-500 italic">Journeys</span></h2>
            <p className="text-sm text-gray-500 mt-2">Scroll through our curated collection</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="min-w-[200px]">
              <label className="block text-xs uppercase text-gray-500">Destination</label>
              <DestinationSelect
                options={DEST_OPTIONS}
                selected={selectedDestinations}
                onChange={setSelectedDestinations}
                buttonClass="w-full text-left px-3 py-2 rounded-md bg-white border"
                dropdownZ={99999}
              />
            </div>

            <div>
              <label className="block text-xs uppercase text-gray-500">From</label>
              <input className="px-3 py-2 rounded-md border" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>

            <div>
              <label className="block text-xs uppercase text-gray-500">To</label>
              <input className="px-3 py-2 rounded-md border" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>

            <div>
              <label className="block text-xs uppercase text-gray-500">Guests</label>
              <input className="px-3 py-2 rounded-md border w-20" type="number" min="1" value={guests} onChange={(e) => setGuests(e.target.value)} />
            </div>

            <div className="pt-6">
              <button className="bg-gray-900 text-white px-4 py-2 rounded-md" onClick={() => {
                const params = new URLSearchParams();
                if (selectedDestinations && selectedDestinations.length) params.set("dest", selectedDestinations.join(','));
                if (from) params.set("from", from);
                if (to) params.set("to", to);
                if (guests) params.set("guests", guests);
                navigate(`/tours?${params.toString()}`);
              }}>Apply</button>
            </div>
          </div>
        </div>

      <div ref={containerRef} className="deck-container">
        {filteredTours.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--dark)" }}>No journeys match your filters.</div>
        ) : (
          [...filteredTours].reverse().map((tour, ri) => {
            const originalIndex = filteredTours.length - 1 - ri;
            const style = getCardStyle(originalIndex, currentIndex, filteredTours.length);
            return (
              <DeckCard
                key={tour.id}
                tour={tour}
                style={style}
                index={originalIndex}
                total={filteredTours.length}
                onSelect={() => navigate(`/tours/${tour.id}`)}
              />
            );
          })
        )}
      </div>

      <div className="deck-dots">
        {filteredTours.map((_, i) => (
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
