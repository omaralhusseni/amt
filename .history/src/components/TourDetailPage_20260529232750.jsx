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
    <section className="min-h-screen" style={{ background: 'var(--sand-light)', paddingTop: 80 }}>
      <button onClick={() => navigate('/tours')} className="absolute top-24 left-[var(--page-pad)] text-sm text-[var(--text-muted)]">← All journeys</button>

      <div className="relative h-[70vh] overflow-hidden">
        <img src={tour.images[0]} alt={tour.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(245,237,224,1) 100%)' }} />
        <div className="absolute left-0 right-0 bottom-0 px-[var(--page-pad)] pb-8">
          <h1 className={`font-serif text-[clamp(3rem,6vw,5.5rem)] font-light text-[var(--dark)]`}>{tour.name}</h1>
          <div className="flex gap-4 mt-3 text-sm text-[var(--text-muted)]">
            <div>Any date</div>
            <div>{tour.interested} interested</div>
            <div>{tour.duration}</div>
          </div>
        </div>
        <button onClick={() => navigate(`/book/${tour.id}`)} className="absolute top-[120px] right-[var(--page-pad)] bg-[var(--dark)] text-[var(--gold)] px-6 py-3 rounded font-semibold">Book — {tour.price}$ / person</button>
      </div>

      <div className="flex gap-3 px-[var(--page-pad)] py-8">
        {tour.images.map((src, i) => (
          <div key={i} className="flex-1 h-48 bg-cover bg-center transition-[flex] duration-500" style={{ backgroundImage: `url(${src})` }} />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-20 px-[var(--page-pad)] pb-20">
        <div>
          <p className="text-xs uppercase tracking-widest text-[var(--gold)] mb-4">About this journey</p>
          <p className="text-[1.3rem] font-serif text-[var(--dark-mid)] italic">{tour.description}</p>
          <div className="w-16 h-px bg-[var(--gold)] my-8" />
          <p className="text-[1.1rem]">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy eiusmod tempor incidunt ut labore et dolore magna aliquyam erat. At vero eos et accusam et justo duo dolores et ea rebum.</p>
        </div>
        <div className="flex flex-col gap-6">
          {[
            ["Duration", tour.duration],
            ["Departure", "Daily departures available"],
            ["Group size", "2 – 12 travelers"],
            ["Price", `${tour.price}$ per person`],
            ["Includes", "Transport, accommodation, guides"],
            ["Language", "Arabic, English, French"],
          ].map(([label, val]) => (
            <div key={label}>
              <div className="text-xs uppercase tracking-widest text-[var(--gold)]">{label}</div>
              <div className="text-base text-[var(--dark)]">{val}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
