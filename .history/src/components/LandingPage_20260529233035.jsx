import { useEffect, useState } from "react";
import DestinationSelect from "./DestinationSelect.jsx";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const [visible, setVisible] = useState(false);
  // multi-select destinations on the landing page
  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const DEST_OPTIONS = ['Siwa','Hurghada','Cairo','Sharm el Sheikh','Dahab','Nuweiba','Luxor','Aswan','Nuba','Alexandria'];
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [guests, setGuests] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  const handleExplore = (e) => {
    e?.preventDefault();
    const params = new URLSearchParams();
    if (selectedDestinations && selectedDestinations.length) params.set("dest", selectedDestinations.join(','));
    if (fromDate) params.set("from", fromDate);
    if (toDate) params.set("to", toDate);
    if (guests) params.set("guests", String(guests));
    navigate(`/tours?${params.toString()}`);
  };

  // DestinationSelect handles its own outside clicks

  return (
    <section className="min-h-screen relative overflow-hidden bg-[radial-gradient(ellipse_at_right,_var(--tw-gradient-stops))] bg-[#0f0b08]">
      {/* background image layer */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=1800&q=85')` }} />

      <div className="relative z-10 px-6 md:px-20 py-16 max-w-7xl mx-auto">
        <div className={`uppercase tracking-widest text-yellow-300 text-sm mb-3 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>Egypt as a local, not a tourist</div>

        <h1 className={`font-serif text-4xl sm:text-6xl md:text-7xl leading-tight text-white ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          You only<br />think you<br /><em className="italic text-yellow-300">know Egypt</em>
        </h1>

        <div className={`w-16 h-px bg-yellow-400 my-6 ${visible ? 'opacity-100' : 'opacity-0'}`} />

        <p className={`max-w-xl text-gray-200 mb-8 ${visible ? 'opacity-100' : 'opacity-0'}`}>
          Curated journeys into the Egypt that doesn't appear in guidebooks. Sacred, silent, and entirely yours.
        </p>

        <form className={`flex flex-wrap items-center gap-3 bg-white/5 backdrop-blur rounded-xl p-4 ${visible ? 'opacity-100' : 'opacity-0'}`} onSubmit={handleExplore}>
          <div className="flex flex-col w-44">
            <label className="text-xs uppercase text-yellow-300">Destination</label>
            <DestinationSelect
              options={DEST_OPTIONS}
              selected={selectedDestinations}
              onChange={setSelectedDestinations}
              buttonClass="w-44 text-left px-3 py-2 rounded-md bg-white/90 text-gray-800"
              dropdownZ={99999}
            />
          </div>

          <div className="h-8 w-px bg-white/10" />

          <div className="flex flex-col">
            <label className="text-xs uppercase text-yellow-300">From</label>
            <input className="px-3 py-2 rounded-md bg-white/90 text-gray-800" type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </div>

          <div className="h-8 w-px bg-white/10" />

          <div className="flex flex-col">
            <label className="text-xs uppercase text-yellow-300">To</label>
            <input className="px-3 py-2 rounded-md bg-white/90 text-gray-800" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </div>

          <div className="h-8 w-px bg-white/10" />

          <div className="flex flex-col">
            <label className="text-xs uppercase text-yellow-300">Guests</label>
            <input className="px-3 py-2 rounded-md bg-white/90 text-gray-800 w-20" type="number" min="1" value={guests} onChange={(e) => setGuests(Math.max(1, Number(e.target.value) || 1))} />
          </div>

          <button className="ml-2 bg-yellow-400 text-black font-semibold px-5 py-2 rounded-md" type="submit">Explore →</button>
        </form>
      </div>

      <div className="absolute left-6 bottom-6 text-xs text-white/60">A.M.T. Tours — Since 1997</div>
    </section>
  );
}
