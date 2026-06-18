import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function TourDetailPage() {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const { tourId } = useParams();
  const [trip, setTrip] = useState(null);
  const [activeScheduleIndex, setActiveScheduleIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState("1");
  const [bookingError, setBookingError] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    fetch(`/api/trips/${tourId}`)
      .then((r) => r.json())
      .then((data) => setTrip(data))
      .catch(() => setTrip(null));
  }, [tourId]);

  if (!trip) {
    return (
      <section className="tour-detail page">
        <button className="back-btn" onClick={() => navigate("/tours")}>
          ← All journeys
        </button>
        <div style={{ padding: 40, textAlign: "center" }}>
          <div style={{ fontSize: "1.2rem", color: "var(--text-muted)" }}>
            Loading...
          </div>
        </div>
      </section>
    );
  }

  const schedules = trip.schedules || [];
  const activeSchedule = schedules[activeScheduleIndex] || null;

  const handleBookClick = async () => {
    setBookingError("");

    if (!selectedDate) {
      setBookingError("Please select a date");
      return;
    }
    if (!numberOfGuests || Number(numberOfGuests) < 1) {
      setBookingError("Please select number of guests");
      return;
    }

    // Redirect to booking page to collect billing info
    navigate("/book/" + trip._id, {
      state: {
        selectedScheduleIndex: activeScheduleIndex,
        selectedDate,
        numberOfGuests: Number(numberOfGuests),
      },
    });
  };

  return (
    <section className="tour-detail page">
      <button className="back-btn" onClick={() => navigate("/tours")}>
        ← All journeys
      </button>

      <div className="tour-hero">
        <img
          src={trip.images[0]}
          alt={trip.name}
          className="tour-hero-img"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div className="tour-hero-overlay" />
        <div className="tour-hero-title">
          <div>
            <h1 className="tour-hero-name">{trip.name}</h1>
          </div>
          <div className="tour-hero-meta">
            <div className="tour-tag">Any date</div>
            <div className="tour-tag">{trip.interested} interested</div>
            <div className="tour-tag">
              {(activeSchedule && (activeSchedule.days || []).length) || 1} days
            </div>
          </div>
        </div>
      </div>

      <div className="tour-thumbs">
        {trip.images.map((src, i) => (
          <div
            key={i}
            className="tour-thumb"
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
      </div>

      <div className="tour-body">
        <div>
          <p
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.3em",
              color: "var(--gold)",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            About this journey
          </p>
          <p className="tour-desc">{trip.description}</p>
          <div className="gold-line" style={{ margin: "32px 0" }} />
        </div>

        <div style={{ marginTop: 20 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            {schedules.map((s, i) => (
              <button
                key={s.name + i}
                type="button"
                onClick={() => setActiveScheduleIndex(i)}
                style={{
                  padding: "8px 12px",
                  borderRadius: 6,
                  border:
                    i === activeScheduleIndex
                      ? "2px solid var(--gold)"
                      : "1px solid #ddd",
                  background: i === activeScheduleIndex ? "#fff8ea" : "#fff",
                  cursor: "pointer",
                }}
              >
                <div className="text text-[var(--gold)]">{s.name}</div>
              </button>
            ))}
          </div>

          {activeSchedule ? (
            <div>
              {(activeSchedule.days || []).map((dayActivities, dayIndex) => (
                <div key={dayIndex} style={{ marginBottom: 18 }}>
                  <h4>Day {dayIndex + 1}</h4>
                  <div>
                    {dayActivities.map((entry, ai) => (
                      <div
                        key={ai}
                        style={{
                          display: "flex",
                          gap: 12,
                          padding: "8px 0",
                          alignItems: "flex-start",
                          borderBottom: "1px solid #f2f2f2",
                        }}
                      >
                        <div style={{ width: 80, color: "var(--text-muted)" }}>
                          {entry.time}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600 }}>
                            <div className="text text-[var(--gold)]">
                              {entry.activity.name}
                            </div>
                          </div>
                          <div
                            style={{
                              color: "var(--text-muted)",
                              fontSize: "0.95rem",
                            }}
                          >
                            {entry.activity.place}
                          </div>
                          <div style={{ marginTop: 6 }}>
                            <div
                              style={{
                                color: "var(--text-muted)",
                                fontSize: "0.95rem",
                              }}
                            >
                              {entry.activity.description}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>No schedule available</div>
          )}
        </div>

        <div style={{ marginTop: 40, paddingBottom: 40 }}>
          <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  color: "var(--text-muted)",
                }}
              >
                Select date
              </label>
              <input
                type="date"
                className="booking-input"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  color: "var(--text-muted)",
                }}
              >
                Number of guests
              </label>
              <input
                type="number"
                className="booking-input"
                value={numberOfGuests}
                onChange={(e) => setNumberOfGuests(e.target.value)}
                min="1"
                style={{ width: "100%" }}
              />
            </div>
          </div>

          {bookingError && (
            <div
              style={{
                color: "#d32f2f",
                marginBottom: 12,
                padding: "8px 12px",
                backgroundColor: "#ffebee",
                borderRadius: 4,
              }}
            >
              {bookingError}
            </div>
          )}

          <button
            type="button"
            className="card-cta"
            onClick={handleBookClick}
            style={{ padding: "12px 24px", fontSize: "1rem", width: "100%" }}
          >
            Book now — $
            {(activeSchedule && activeSchedule.price_per_person) || 0} / person
          </button>
        </div>
      </div>
    </section>
  );
}
