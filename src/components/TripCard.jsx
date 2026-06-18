import { useNavigate } from "react-router-dom";

export default function TripCard({ trip }) {
  const navigate = useNavigate();

  const daysCounts =
    trip.schedules && trip.schedules.length > 0
      ? trip.schedules.map((s) => (s.days || []).length)
      : [1];
  const minDays = Math.min(...daysCounts);
  const maxDays = Math.max(...daysCounts);

  return (
    <div
      className="trip-card text-black flex gap-4"
      style={{
        padding: 20,
        border: "1px solid var(--border)",
        borderRadius: 8,
      }}
    >
      <div style={{ width: 220, display: "grid", gap: 8 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {(trip.images || []).slice(0, 3).map((src, i) => (
            <div
              key={i}
              style={{
                width: 70,
                height: 70,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundImage: `url(${src})`,
              }}
            />
          ))}
        </div>
        <div className="flex flex-col">
          <div style={{ color: "var(--gold)" }}>
            {minDays !== maxDays
              ? `${minDays}–${maxDays} days`
              : `${minDays == 1 ? "1 day" : `${minDays} days`}`}
          </div>
          <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
            {trip.interested} interested
          </div>
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3 style={{ margin: 0 }}>{trip.name}</h3>
        </div>
        <p style={{ marginTop: 8, color: "var(--text-muted)" }}>
          {trip.description}
        </p>

        <div style={{ marginTop: 12 }}>
          <button
            className="card-cta"
            onClick={() => navigate(`/tours/${trip._id}`)}
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
}
