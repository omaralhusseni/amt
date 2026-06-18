export default function DeckCard({ tour, style, onSelect, index, total }) {
  return (
    <div className="deck-card" style={style} onClick={onSelect}>
      <div className="card-inner">
        <div className="card-left">
          <div>
            <div className="card-tour-meta">
              <div className="card-date-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Any date
              </div>
              <div className="card-interested">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                {tour.interested} interested
              </div>
            </div>
            <div className="card-name">{tour.name}</div>
            <div className="card-subtitle">{tour.subtitle}</div>
            <div className="card-desc">{tour.description}</div>
          </div>
          <div className="card-bottom">
            <div>
              <div className="card-price">
                {tour.price}$<span>/person</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="card-cta" style={{ background: "transparent", border: "1px solid #c8a152", color: "#c8a152" }}>
                Read more
              </button>
              <button className="card-cta">Book</button>
            </div>
          </div>
        </div>
        <div className="card-right">
          <div className="card-images">
            {tour.images.map((src, i) => (
              <div
                key={i}
                className="card-img"
                style={{ backgroundImage: `url(${src})` }}
              />
            ))}
          </div>
          <div className="card-counter">{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</div>
        </div>
      </div>
    </div>
  );
}
