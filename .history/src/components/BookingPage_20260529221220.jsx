import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { tours } from "../toursData.js";

const createEmptyGuests = (count) =>
  Array.from({ length: count }, () => ({ name: "", phone: "" }));

export default function BookingPage() {
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({
    contactName: "",
    email: "",
    phone: "",
    numberOfGuests: 1,
    guestDetails: createEmptyGuests(1),
    notes: "",
  });
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const navigate = useNavigate();
  const { tourId } = useParams();

  const tour = useMemo(
    () => tours.find((item) => item.id.toString() === tourId),
    [tourId],
  );

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    setForm((current) => {
      const newCount = Math.max(1, Number(current.numberOfGuests) || 1);
      const guests = [...current.guestDetails];
      if (guests.length < newCount) {
        guests.push(...createEmptyGuests(newCount - guests.length));
      } else if (guests.length > newCount) {
        guests.length = newCount;
      }
      return { ...current, numberOfGuests: newCount, guestDetails: guests };
    });
  }, [form.numberOfGuests]);

  if (!tour) {
    return <Navigate to="/tours" replace />;
  }

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleGuestChange = (index, field) => (event) => {
    const value = event.target.value;
    setForm((current) => {
      const guestDetails = [...current.guestDetails];
      guestDetails[index] = { ...guestDetails[index], [field]: value };
      return { ...current, guestDetails };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: "pending", message: "Booking your trip…" });

    try {
      const response = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tourId: tour.id,
          tourName: tour.name,
          contactName: form.contactName,
          email: form.email,
          phone: form.phone,
          numberOfGuests: form.numberOfGuests,
          guestDetails: form.guestDetails,
          notes: form.notes,
        }),
      });

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload?.error || "Unable to book trip");
      }

      const payload = await response.json();
      setStatus({
        type: "success",
        message: `Trip booked. Thank you for booking! Reference: ${payload.bookingId}`,
      });
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Booking failed." });
    }
  };

  return (
    <section className="booking-page page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back to tour
      </button>

      <div className="booking-panel fade-up fade-up-1" style={{ paddingTop: 120 }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: "0.65rem", letterSpacing: "0.3em", color: "var(--gold)", textTransform: "uppercase", marginBottom: 14 }}>
            Booking for
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.25rem, 4vw, 3.5rem)", color: "var(--dark)", lineHeight: 1.05 }}>
            {tour.name}
          </h1>
          <p style={{ maxWidth: 680, marginTop: 18, color: "var(--dark-mid)", lineHeight: 1.8 }}>
            Please enter your contact details and traveler information below. We will confirm your booking and contact you with next steps.
          </p>
        </div>

        <form className="booking-form" onSubmit={handleSubmit}>
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
                onChange={(event) => setForm((current) => ({
                  ...current,
                  numberOfGuests: Number(event.target.value) || 1,
                }))}
              />
            </label>
          </div>

          <div className="booking-section">
            <h2>Guest details</h2>
            <p style={{ marginBottom: 20, color: "var(--text-muted)", maxWidth: 680 }}>
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
                    onChange={handleGuestChange(index, "name")}
                    required
                  />
                </label>
                <label className="booking-label">
                  Phone
                  <input
                    className="booking-input"
                    type="tel"
                    value={guest.phone}
                    onChange={handleGuestChange(index, "phone")}
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

          <div className="form-actions">
            <button className="card-cta" type="submit" disabled={status.type === "pending"}>
              {status.type === "pending" ? "Booking…" : "Confirm booking"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
