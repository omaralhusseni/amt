import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { tours } from "../toursData.js";

export default function TourDetailPage() {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const { tourId } = useParams();

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(timeout);
  }, []);

  const tour = useMemo(
    () => tours.find((item) => item.id.toString() === tourId),
    [tourId],
  );

  if (!tour) {
    return <Navigate to="/tours" replace />;
  }

  return (
    <section className="tour-detail page bg-red-500">
      <button className="back-btn" onClick={() => navigate("/tours")}>← All journeys</button>

      <div className="tour-hero">
        <img
          src={tour.images[0]}
          alt={tour.name}
          className="tour-hero-img"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div className="tour-hero-overlay" />
        <div className="tour-hero-title">
          <div className={`fade-up fade-up-1 ${visible ? "" : ""}`}>
            <h1 className="tour-hero-name">{tour.name}</h1>
          </div>
          <div className="tour-hero-meta fade-up fade-up-2">
            <div className="tour-tag">Any date</div>
            <div className="tour-tag">{tour.interested} interested</div>
            <div className="tour-tag">{tour.duration}</div>
          </div>
        </div>
        <button className="tour-book-btn fade-up fade-up-3" onClick={() => navigate(`/book/${tour.id}`)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          Book — {tour.price}$ / person
        </button>
      </div>

      <div className="tour-thumbs fade-up fade-up-2">
        {tour.images.map((src, i) => (
          <div
            key={i}
            className="tour-thumb"
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
      </div>

      <div className="tour-body">
        <div>
          <p style={{ fontSize: "0.65rem", letterSpacing: "0.3em", color: "var(--gold)", textTransform: "uppercase", marginBottom: 16 }}>
            About this journey
          </p>
          <p className="tour-desc fade-up fade-up-1">{tour.description}</p>
          <div className="gold-line" style={{ margin: "32px 0" }} />
          <p className="tour-desc fade-up fade-up-2" style={{ fontSize: "1.1rem" }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy eiusmod tempor incidunt ut labore et dolore magna aliquyam erat. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>
        <div className="tour-details-grid fade-up fade-up-3">
          {[
            ["Duration", tour.duration],
            ["Departure", "Daily departures available"],
            ["Group size", "2 – 12 travelers"],
            ["Price", `${tour.price}$ per person`],
            ["Includes", "Transport, accommodation, guides"],
            ["Language", "Arabic, English, French"],
          ].map(([label, val]) => (
            <div key={label} className="tour-detail-item">
              <span className="tour-detail-label">{label}</span>
              <span className="tour-detail-val">{val}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
