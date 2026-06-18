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

  const updateGuestCount = (value) => {
    const newCount = Math.max(1, Number(value) || 1);
    setForm((current) => {
      const guests = [...current.guestDetails];
      if (guests.length < newCount) {
        guests.push(...createEmptyGuests(newCount - guests.length));
      } else if (guests.length > newCount) {
        guests.length = newCount;
      }
      return { ...current, numberOfGuests: newCount, guestDetails: guests };
    });
  };

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
    <section className="min-h-screen bg-[var(--sand-light)] pt-24 pb-20">
      <button onClick={() => navigate(-1)} className="absolute top-24 left-[var(--page-pad)] text-sm text-[var(--text-muted)]">← Back to tour</button>

      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-12 mt-24">
        <div className="mb-8">
          <div className="text-xs uppercase tracking-widest text-[var(--gold)] mb-3">Booking for</div>
          <h1 className="font-serif text-3xl text-[var(--dark)]">{tour.name}</h1>
          <p className="mt-4 text-[var(--dark-mid)]">Please enter your contact details and traveler information below. We will confirm your booking and contact you with next steps.</p>
        </div>

        <form className="grid gap-8" onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <h2 className="text-lg font-medium">Contact information</h2>
            <label className="flex flex-col gap-2">
              <span>Full name</span>
              <input className="border rounded-lg px-4 py-3" type="text" value={form.contactName} onChange={handleChange('contactName')} required />
            </label>
            <label className="flex flex-col gap-2">
              <span>Email address</span>
              <input className="border rounded-lg px-4 py-3" type="email" value={form.email} onChange={handleChange('email')} required />
            </label>
            <label className="flex flex-col gap-2">
              <span>Phone number</span>
              <input className="border rounded-lg px-4 py-3" type="tel" value={form.phone} onChange={handleChange('phone')} required />
            </label>
            <label className="flex flex-col gap-2 w-40">
              <span>Total guests</span>
              <input className="border rounded-lg px-4 py-3" type="number" min="1" value={form.numberOfGuests} onChange={(e) => updateGuestCount(e.target.value)} />
            </label>
          </div>

          <div className="grid gap-4">
            <h2 className="text-lg font-medium">Guest details</h2>
            <p className="text-sm text-[var(--text-muted)]">Provide the name and phone number for each traveler.</p>
            {form.guestDetails.map((guest, index) => (
              <div key={index} className="bg-[#fff9f1] p-4 rounded-lg border">
                <div className="text-xs text-[var(--gold)] mb-2">Guest {index + 1}</div>
                <label className="flex flex-col gap-2">
                  <span>Name</span>
                  <input className="border rounded-lg px-4 py-3" type="text" value={guest.name} onChange={handleGuestChange(index, 'name')} required />
                </label>
                <label className="flex flex-col gap-2 mt-3">
                  <span>Phone</span>
                  <input className="border rounded-lg px-4 py-3" type="tel" value={guest.phone} onChange={handleGuestChange(index, 'phone')} required />
                </label>
              </div>
            ))}
          </div>

          <div>
            <label className="flex flex-col gap-2">
              <span>Notes</span>
              <textarea className="border rounded-lg px-4 py-3 min-h-[120px]" value={form.notes} onChange={handleChange('notes')} rows="4" placeholder="Share any preferences or questions about the trip" />
            </label>
          </div>

          {status.type === 'success' && <div className="p-4 rounded text-green-800 bg-green-50">{status.message}</div>}
          {status.type === 'error' && <div className="p-4 rounded text-red-800 bg-red-50">{status.message}</div>}

          <div>
            <button className="bg-amber-300 text-[#1a1410] px-6 py-3 rounded font-semibold" type="submit" disabled={status.type === 'pending'}>{status.type === 'pending' ? 'Booking…' : 'Confirm booking'}</button>
          </div>
        </form>
      </div>
    </section>
  );
}
