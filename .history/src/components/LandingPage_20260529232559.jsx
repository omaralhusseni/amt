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
    <section className="min-h-screen flex flex-col justify-center items-start relative overflow-hidden">
      <div className="absolute inset-0 bg-center bg-cover" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=1800&q=85")' }} />
      <div className="relative z-10" style={{ paddingLeft: 'var(--page-pad)', paddingRight: 'var(--page-pad)' }}>
        <div className={`text-xs tracking-widest text-amber-400 uppercase mb-5 transform transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          Egypt as a local, not a tourist
        </div>
        <h1 className={`font-serif text-[clamp(3rem,7vw,6rem)] leading-tight text-white transform transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          You only<br />think you<br /><em className="italic text-amber-200">know Egypt</em>
        </h1>
        <div className={`w-14 h-px bg-amber-400 my-6 ${visible ? 'opacity-100' : 'opacity-0'}`} />
        <p className={`max-w-[420px] text-sm text-amber-100 mb-8 transform transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          Curated journeys into the Egypt that doesn't appear in guidebooks. Sacred, silent, and entirely yours.
        </p>

        <form className={`flex items-center gap-3 bg-white/5 backdrop-blur-md border border-amber-200/20 p-4 rounded-lg transform transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} onSubmit={handleExplore}>
          <div className="flex flex-col gap-1 min-w-[180px]">
            <label className="text-xxs text-amber-300 uppercase tracking-wider">Destination</label>
            <DestinationSelect
              options={DEST_OPTIONS}
              selected={selectedDestinations}
              onChange={setSelectedDestinations}
              buttonClass="text-left bg-transparent text-white py-2 px-3 rounded"
              dropdownZ={99999}
            />
          </div>
          <div className="w-px h-9 bg-amber-200/20" />
          <div className="flex flex-col gap-1">
            <label className="text-xxs text-amber-300 uppercase tracking-wider">From</label>
            <input className="bg-transparent text-white py-2 px-3 rounded" type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </div>
          <div className="w-px h-9 bg-amber-200/20" />
          <div className="flex flex-col gap-1">
            <label className="text-xxs text-amber-300 uppercase tracking-wider">To</label>
            <input className="bg-transparent text-white py-2 px-3 rounded" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </div>
          <div className="w-px h-9 bg-amber-200/20" />
          <div className="flex flex-col gap-1">
            <label className="text-xxs text-amber-300 uppercase tracking-wider">Guests</label>
            <input className="bg-transparent text-white py-2 px-3 rounded w-20" type="number" min="1" value={guests} onChange={(e) => setGuests(Math.max(1, Number(e.target.value) || 1))} />
          </div>
          <button className="ml-2 bg-amber-300 text-dark px-4 py-2 rounded font-semibold" type="submit">Explore →</button>
        </form>
      </div>

      <div className={`absolute bottom-10 left-[var(--page-pad)] text-sm text-amber-200 ${visible ? 'opacity-100' : 'opacity-0'}`}>A.M.T. Tours — Since 1997</div>
      <div className={`absolute bottom-10 right-[var(--page-pad)] flex flex-col items-center gap-2 text-amber-200 ${visible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="w-px h-12 bg-gradient-to-b from-amber-300 to-transparent animate-pulse" />
        <span className="text-xs tracking-widest">Scroll</span>
      </div>
    </section>
  );
}
