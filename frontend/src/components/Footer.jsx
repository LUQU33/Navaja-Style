import { useState } from "react";
import "./Footer.css";

const COLUMNS = [
  {
    title: "Tienda",
    links: ["Colección", "Accesorios", "Rebajas", "Catálogo completo"],
  },
  {
    title: "Ayuda",
    links: ["Envíos", "Cambios y devoluciones", "Preguntas frecuentes", "Contacto"],
  },
  {
    title: "Legal",
    links: ["Términos y condiciones", "Política de privacidad"],
  },
];

export default function Footer({ onSubscribe = () => {} }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    onSubscribe(email);
    setSent(true);
    setEmail("");
  };

  return (
    <footer className="navaja-footer">
      <div className="top">
        <div className="brand-block">
          <div className="logo">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 15 L18 6 C20 5 22 6.5 21 8.5 L13 18 L3 15Z" stroke="#c65a44" strokeWidth="1.4" />
            </svg>
            <span className="brand-word">Navaja</span>
          </div>
          <p className="tagline">
            Prendas y accesorios pensados con la misma precisión que una navaja bien afilada.
          </p>
          <div className="socials">
            <a href="#instagram" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a href="#tiktok" aria-label="TikTok">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14 4v9.5a3.5 3.5 0 1 1-3-3.46" />
                <path d="M14 4c.4 2.2 2 3.6 4 3.8" />
              </svg>
            </a>
          </div>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="col-title">{col.title}</h4>
            <ul className="col-links">
              {col.links.map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}>{link}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="newsletter">
          <h4 className="col-title">Newsletter</h4>
          <p>Enterate antes que nadie de lanzamientos y rebajas.</p>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              required
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit">Sumarme</button>
          </form>
          {sent && <div className="sent">¡Listo! Ya estás suscripto.</div>}
        </div>
      </div>

      <div className="bottom">
        <span>© {new Date().getFullYear()} Navaja - Style. Todos los derechos reservados.</span>
        <span>Hecho en Argentina</span>
      </div>
    </footer>
  );
}