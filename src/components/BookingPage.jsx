import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
  useLocation,
  Navigate,
} from "react-router-dom";

const createEmptyGuests = (count) =>
  Array.from({ length: count }, () => ({ name: "", phone: "" }));

export default function BookingPage() {
  const [visible] = useState(true);
  const [form, setForm] = useState({
    contactName: "",
    email: "",
    phone: "",
    numberOfGuests: 1,
    guestDetails: createEmptyGuests(1),
    notes: "",
    currency: "EGP",
  });
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const navigate = useNavigate();
  const { tourId } = useParams();
  const { state } = useLocation();

  const [tour, setTour] = useState(null);
  const [tourLoading, setTourLoading] = useState(true);
  const [tourError, setTourError] = useState(false);
  const preselectedScheduleIndex = state?.selectedScheduleIndex || 0;
  const [selectedScheduleIndex, setSelectedScheduleIndex] = useState(
    preselectedScheduleIndex
  );

  // Prefill from trip detail page if passed
  useEffect(() => {
    if (state?.numberOfGuests) {
      updateGuestCount(state.numberOfGuests);
    }
  }, [state?.numberOfGuests]);

  useEffect(() => {
    if (tourId) {
      setTourLoading(true);
      setTourError(false);
      fetch(`/api/trips/${tourId}`)
        .then((r) => {
          if (!r.ok) throw new Error("Failed to fetch tour");
          return r.json();
        })
        .then((data) => {
          setTour(data);
          setTourLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching tour:", error);
          setTourLoading(false);
          setTourError(true);
        });
    }
  }, [tourId]);

  const updateGuestCount = (value) => {
    const newCount = Math.max(1, Number(value) || 1);
    setForm((current) => {
      const guests = [...current.guestDetails];
      if (guests.length < newCount)
        guests.push(...createEmptyGuests(newCount - guests.length));
      else if (guests.length > newCount) guests.length = newCount;
      return { ...current, numberOfGuests: newCount, guestDetails: guests };
    });
  };

  if (tourLoading) {
    return (
      <section className="booking-page page">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back to tour
        </button>
        <div
          style={{
            paddingTop: 120,
            textAlign: "center",
            padding: "120px 20px",
          }}
        >
          <div style={{ fontSize: "1.2rem", color: "var(--text-muted)" }}>
            Loading booking details...
          </div>
        </div>
      </section>
    );
  }

  if (tourError || !tour) {
    return (
      <section className="booking-page page">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back to tour
        </button>
        <div
          style={{
            paddingTop: 120,
            textAlign: "center",
            padding: "120px 20px",
          }}
        >
          <div style={{ fontSize: "1.2rem", color: "var(--error)" }}>
            Error loading tour details
          </div>
          <button
            onClick={() => navigate("/tours")}
            style={{
              marginTop: 20,
              padding: "10px 20px",
              backgroundColor: "var(--gold)",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Back to Tours
          </button>
        </div>
      </section>
    );
  }

  const handleChange = (field) => (event) =>
    setForm((current) => ({ ...current, [field]: event.target.value }));
  const handleGuestChange = (index, field) => (event) =>
    setForm((current) => {
      const guestDetails = [...current.guestDetails];
      guestDetails[index] = {
        ...guestDetails[index],
        [field]: event.target.value,
      };
      return { ...current, guestDetails };
    });

  const handlePayNow = async (event) => {
    event.preventDefault();
    setStatus({ type: "pending", message: "Booking your trip…" });
    try {
      const amount =
        (tour.schedules &&
          tour.schedules[selectedScheduleIndex] &&
          tour.schedules[selectedScheduleIndex].price_per_person) ||
        0;
      const notes = state?.selectedDate
        ? `Preferred date: ${state.selectedDate}\n${form.notes}`
        : form.notes;
      const response = await fetch("/api/checkout/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tourId: tour._id,
          tourName: tour.name,
          contactName: form.contactName,
          email: form.email,
          phone: form.phone,
          numberOfGuests: form.numberOfGuests,
          guestDetails: form.guestDetails,
          notes,
          amount,
          currency: form.currency,
          selectedSchedule: tour.schedules
            ? tour.schedules[selectedScheduleIndex]
            : null,
        }),
      });
      if (!response.ok) {
        const payload = await response.json();
        throw new Error("Please fill all information correctly");
      }
      const payload = await response.json();
      navigate("/checkout", {
        state: { iframeUrl: payload.iframeUrl, bookingId: payload.bookingId },
      });
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Booking failed." });
    }
  };

  const handlePayLater = async (event) => {
    event.preventDefault();
    setStatus({ type: "pending", message: "Saving your booking…" });
    try {
      const response = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tourId: tour._id,
          tourName: tour.name,
          contactName: form.contactName,
          email: form.email,
          phone: form.phone,
          numberOfGuests: form.numberOfGuests,
          guestDetails: form.guestDetails,
          notes: form.notes,
          selectedSchedule: tour.schedules
            ? tour.schedules[selectedScheduleIndex]
            : null,
        }),
      });
      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload?.error || "Unable to save booking");
      }
      const payload = await response.json();
      setStatus({
        type: "success",
        message: `Booking saved. Reference: ${payload.bookingId}`,
      });
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Booking failed." });
    }
  };

  return (
    <section className="booking-page page">
      <div className="booking-panel">
        <div style={{ marginBottom: 32 }}>
          <div
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.3em",
              color: "var(--gold)",
              textTransform: "uppercase",
              marginBottom: 14,
            }}
          >
            Booking for
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.25rem, 4vw, 3.5rem)",
              color: "var(--dark)",
              lineHeight: 1.05,
            }}
          >
            {tour.name}
          </h1>
          <p
            style={{
              maxWidth: 680,
              marginTop: 18,
              color: "var(--dark-mid)",
              lineHeight: 1.8,
            }}
          >
            Please enter your contact details and traveler information below. We
            will confirm your booking and contact you with next steps.
          </p>
        </div>

        <form className="booking-form">
          <div className="booking-section">
            <h2>Contact information</h2>
            <label className="booking-label">
              Full name
              <input
                className="booking-input"
                type="text"
                value={form.contactName}
                onChange={handleChange("contactName")}
                required
              />
            </label>
            <label className="booking-label">
              Email address
              <input
                className="booking-input"
                type="email"
                value={form.email}
                onChange={handleChange("email")}
                required
              />
            </label>
            <label className="booking-label">
              Phone number
              <input
                className="booking-input"
                type="tel"
                value={form.phone}
                onChange={handleChange("phone")}
                required
              />
            </label>
            <label className="booking-label">
              Total guests
              <input
                className="booking-input"
                type="number"
                min="1"
                value={form.numberOfGuests}
                onChange={(e) => updateGuestCount(e.target.value)}
              />
            </label>
          </div>

          <div className="booking-section">
            <h2>Trip details</h2>
            {state?.selectedDate && (
              <label className="booking-label">
                Preferred date
                <input
                  className="booking-input"
                  type="text"
                  value={state.selectedDate}
                  disabled
                />
              </label>
            )}
            <label className="booking-label">
              Currency
              <select
                value={form.currency}
                onChange={(e) =>
                  setForm((f) => ({ ...f, currency: e.target.value }))
                }
              >
                <option value="EGP">EGP (Egyptian Pound)</option>
                <option value="USD">USD (US Dollar)</option>
                <option value="EUR">EUR (Euro)</option>
              </select>
            </label>
          </div>

          <div className="booking-section">
            <h2>Guest details</h2>
            <p
              style={{
                marginBottom: 20,
                color: "var(--text-muted)",
                maxWidth: 680,
              }}
            >
              Provide the name and phone number for each traveler.
            </p>
            {form.guestDetails.map((guest, index) => (
              <div key={index} className="guest-row">
                <span className="guest-index">Guest {index + 1}</span>
                <label className="booking-label">
                  Name
                  <input
                    className="booking-input"
                    type="text"
                    value={guest.name}
                    onChange={(e) => handleGuestChange(index, "name")(e)}
                    required
                  />
                </label>
                <label className="booking-label">
                  Phone
                  <input
                    className="booking-input"
                    type="tel"
                    value={guest.phone}
                    onChange={(e) => handleGuestChange(index, "phone")(e)}
                    required
                  />
                </label>
              </div>
            ))}
          </div>

          <div className="booking-section">
            <label className="booking-label">
              Notes
              <textarea
                className="booking-textarea"
                value={form.notes}
                onChange={handleChange("notes")}
                rows="4"
                placeholder="Share any preferences or questions about the trip"
              />
            </label>
          </div>

          {status.type === "success" ? (
            <div className="success-message">{status.message}</div>
          ) : null}
          {status.type === "error" ? (
            <div className="error-message">{status.message}</div>
          ) : null}

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", marginBottom: 8 }}>
              Selected schedule
            </label>
            <select
              value={selectedScheduleIndex}
              onChange={(e) => setSelectedScheduleIndex(Number(e.target.value))}
            >
              {(tour.schedules || []).map((s, i) => (
                <option key={i} value={i}>
                  {s.name} — {s.price_per_person}$ per person
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions" style={{ display: "flex", gap: 12 }}>
            <button
              type="button"
              className="card-cta"
              onClick={handlePayNow}
              disabled={status.type === "pending"}
            >
              Pay now
            </button>
            <button
              type="button"
              className="card-cta"
              onClick={handlePayLater}
              disabled={status.type === "pending"}
              style={{
                background: "transparent",
                border: "1px solid #c8a152",
                color: "#c8a152",
              }}
            >
              Pay later
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
