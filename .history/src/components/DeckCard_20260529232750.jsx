export default function DeckCard({ tour, style, onSelect, index, total }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden cursor-pointer" style={style} onClick={onSelect}>
      <div className="grid grid-cols-2 h-full">
        <div className="p-12 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <div className="text-xs text-gray-500 flex items-center gap-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Any date
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                {tour.interested} interested
              </div>
            </div>
            <div className="font-serif text-4xl font-light text-gray-900 my-3">{tour.name}</div>
            <div className="text-xs uppercase tracking-wider text-gray-500">{tour.subtitle}</div>
            <div className="text-sm text-[#5a4a3a] mt-4">{tour.description}</div>
          </div>
          <div className="card-bottom">
            <div>
              <div className="card-price">
                {tour.price}$<span>/person</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded border border-amber-400 text-amber-400 bg-transparent">Read more</button>
              <button className="px-4 py-2 rounded bg-amber-300 text-[#1a1410]">Book</button>
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden">
          <div className="grid grid-cols-2 grid-rows-2 h-full gap-1">
            {tour.images.map((src, i) => (
              <div key={i} className="bg-cover bg-center transition-transform duration-500" style={{ backgroundImage: `url(${src})` }} />
            ))}
          </div>
          <div className="absolute top-4 right-4 z-10 text-xs text-white bg-black/30 backdrop-blur px-2 py-1 rounded">{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</div>
        </div>
      </div>
    </div>
  );
}
