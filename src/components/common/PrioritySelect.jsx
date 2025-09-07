// src/components/common/PrioritySelect.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";


const norm = (v) => (v ?? "").toString().trim().toLowerCase();


function getDotClass(value) {
  const x = norm(value);
  if (x === "all" || x === "") return ""; // nötr


  if (x === "high" || x === "medium" || x === "low" || x === "yüksek" || x === "orta" || x === "düşük") {
    if (x === "yüksek") return "pri-high";
    if (x === "orta")   return "pri-medium";
    if (x === "düşük")  return "pri-low";
    return `pri-${x}`; 
  }

  
  if (x === "açık" || x === "open" || x === "new" || x === "active") return "status-dot--open";
  if (x === "çözülüyor" || x.includes("progress") || x.includes("devam")) return "status-dot--inprogress";
  if (x === "kapalı" || x === "closed" || x === "resolved" || x === "done") return "status-dot--closed";

  return ""; 
}

export default function PrioritySelect({
  id,
  value,
  options = [],
  onChange,
  ariaLabel,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current = useMemo(() => {
    const i = options.findIndex(o => o.value === value);
    return i >= 0 ? options[i] : null;
  }, [options, value]);

  
  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  
  const pick = (opt) => {
    onChange?.({ target: { value: opt.value } });
    setOpen(false);
  };

  const btnDotClass = getDotClass(current?.value);
  return (
    <div className="psel" ref={ref}>
      <button
        id={id}
        type="button"
        className="psel-btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen(v => !v)}
      >
        <span className={`psel-dot ${btnDotClass}`} />
        <span className="psel-label">{current?.label ?? "—"}</span>
        <span className={`psel-caret ${open ? "open" : ""}`}>▾</span>
      </button>

      {open && (
        <div className="psel-menu" role="listbox" aria-labelledby={id}>
          {options.map((opt) => {
            const selected = opt.value === value;
            const dotClass = getDotClass(opt.value);
            return (
              <div
                key={opt.value}
                role="option"
                aria-selected={selected}
                className={`psel-item ${selected ? "selected" : ""}`}
                onClick={() => pick(opt)}
              >
                <span className={`psel-dot ${dotClass}`} />
                <span>{opt.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
