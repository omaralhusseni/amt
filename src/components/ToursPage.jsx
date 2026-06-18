import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DestinationSelect from "./DestinationSelect.jsx";
import TripCard from "./TripCard.jsx";

export default function ToursPage() {
  const [trips, setTrips] = useState([]);
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

  const [filteredTrips, setFilteredTrips] = useState([]);

  useEffect(() => {
    // fetch trips from server
    fetch("/api/trips")
      .then((r) => r.json())
      .then((data) => {
        setTrips(data || []);
        setFilteredTrips(data || []);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    // apply simple filters client-side
    const fFrom = from ? new Date(from) : null;
    const fTo = to ? new Date(to) : null;
    const nfFrom = fFrom ? new Date(fFrom.setHours(0,0,0,0)) : null;
    const nfTo = fTo ? new Date(fTo.setHours(0,0,0,0)) : null;

    const filtered = trips.filter((t) => {
      if (selectedDestinations && selectedDestinations.length > 0) {
        const hay = `${t.name} ${t.subtitle}`.toLowerCase();
        const matches = selectedDestinations.some((d) => hay.includes(d.toLowerCase()));
        if (!matches) return false;
      }
      // date filters not applied to trips without availability data
      return true;
    });

    setFilteredTrips(filtered);
  }, [trips, selectedDestinations, from, to]);

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
        {/* <div className="filter-bar">
          <div className="date-input" style={{ minWidth: 200 }}>
            <label className="search-label">Destination</label>
            <DestinationSelect
              options={DEST_OPTIONS}
              selected={selectedDestinations}
              onChange={setSelectedDestinations}
              buttonClass="booking-input"
              dropdownZ={99999}
            />
          </div> */}
          {/* <div className="date-input">
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
          </div> */}
          {/* <div className="filter-actions">
            <button className="nav-btn" onClick={() => {
              const params = new URLSearchParams();
              if (selectedDestinations && selectedDestinations.length) params.set("dest", selectedDestinations.join(','));
              if (from) params.set("from", from);
              if (to) params.set("to", to);
              if (guests) params.set("guests", guests);
              navigate(`/tours?${params.toString()}`);
            }}>Apply</button>
          </div> */}
        {/* </div> */}
      </div>

      <div>
        {filteredTrips.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--dark)" }}>No journeys match your filters.</div>
        ) : (
          filteredTrips.map((trip) => (
            <TripCard key={trip._id} trip={trip} />
          ))
        )}
      </div>

      <div style={{ padding: 20 ,marginTop: 28, color: "var(--text-muted)" }}>Showing {filteredTrips.length} journeys</div>
    </section>
  );
}
