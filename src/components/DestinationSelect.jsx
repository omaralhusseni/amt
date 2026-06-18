import { useEffect, useRef, useState } from 'react';

export default function DestinationSelect({
  options = [],
  selected = [],
  onChange = () => {},
  placeholder = 'Any destination',
  buttonClass = '',
  dropdownZ = 9999,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  const toggle = (d) => {
    if (selected.includes(d)) onChange(selected.filter((s) => s !== d));
    else onChange([...selected, d]);
  };

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%' }}>
      <button type="button" className={buttonClass} onClick={() => setOpen((s) => !s)} style={{ textAlign: 'left' }}>
        {selected.length === 0 ? placeholder : selected.join(', ')}
      </button>
      {open && (
        <div style={{ position: 'absolute', zIndex: dropdownZ, top: '110%', left: 0, right: 0, background: 'white', borderRadius: 10, padding: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.12)', color: 'var(--dark)' }}>
          {options.map((d) => (
            <label key={d} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 4px', cursor: 'pointer' }}>
              <input type="checkbox" checked={selected.includes(d)} onChange={() => toggle(d)} />
              <span style={{ fontSize: '0.95rem' }}>{d}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
