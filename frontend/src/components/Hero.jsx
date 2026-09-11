import { useEffect, useRef, useState } from "react";
import "./Hero.css";

export default function Hero() {
  const [ready, setReady] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`navaja-hero${ready ? " is-ready" : ""}`} ref={heroRef}>
      <div className="panel-right" aria-hidden="true" />

      <svg className="edge-svg" viewBox="0 0 1180 620" preserveAspectRatio="none" aria-hidden="true">
        <line className="edge-path" x1="543" y1="0" x2="401" y2="620" />
        <line className="edge-glint" x1="543" y1="0" x2="401" y2="620" />
      </svg>

      <div className="content">
        <div className="copy">
          <div className="eyebrow">Navaja — Estilo al filo</div>
          <h1>
            Cada detalle,<br />
            un corte <span>preciso</span>.
          </h1>
          <p className="sub">
            Prendas y accesorios pensados con la misma precisión que una navaja bien afilada.
            Sin vueltas. Sin relleno.
          </p>
          <div className="actions">
            <button className="btn-primary">Ver la colección</button>
            <a className="link-secondary" href="#historia">Nuestra historia</a>
          </div>
        </div>

        <div className="showcase">
          <div className="blade-wrap">
            <span className="spec-label top">Ed. 04 — Acero</span>
            <svg viewBox="0 0 300 180" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g opacity="0.9">
                <path
                  d="M20 90 L200 55 C230 49 255 60 270 85 C255 78 235 78 215 85 L40 105 Z"
                  stroke="#cdd1d6" strokeWidth="1.2" fill="none"
                />
                <path d="M20 90 L40 105 L36 112 L16 96 Z" stroke="#8a8f98" strokeWidth="1" fill="none" />
                <line x1="40" y1="105" x2="230" y2="72" stroke="#4a4e55" strokeWidth="0.6" strokeDasharray="2 3" />
                <circle cx="230" cy="72" r="2" fill="#8a8f98" />
              </g>
            </svg>
            <span className="spec-label bottom">Filo — 100% manual</span>
          </div>
        </div>
      </div>
    </div>
  );
}