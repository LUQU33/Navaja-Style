import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useEffect, useState, useRef } from "react";
import { listarCategorias } from "../api/categorias";
import "./Navbar.css";

export default function Navbar({
  onSearch = () => {},
}) {
  const { count: cartCount } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Si falla, el menú queda sin categorías; el resto de la barra sigue funcionando
    listarCategorias().then(setCategorias).catch(() => {});
  }, []);

  useEffect(() => {
    if (searchOpen && inputRef.current) inputRef.current.focus();
  }, [searchOpen]);

  const submitSearch = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <header className={`navaja-nav${scrolled ? " is-scrolled" : ""}`}>
      <div className="bar">
        <button className="burger icon-btn" onClick={() => setMenuOpen((v) => !v)} aria-label="Abrir menú">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <Link to="/" className="logo" aria-label="Navaja - Style, inicio">
          <svg className="mark" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 15 L18 6 C20 5 22 6.5 21 8.5 L13 18 L3 15Z" stroke="#c65a44" strokeWidth="1.4" />
          </svg>
          <span className="logo-word">Navaja</span>
          <span className="logo-sub">Style</span>
        </Link>

        <nav className={`links${menuOpen ? " open" : ""}`}>
          {categorias.map((cat) => (
            <Link 
              key={cat.id} 
              className="nav-link" 
              to={`/catalogo?categoria=${cat.id}`}
              onClick={() => setMenuOpen(false)}
              //El onClick cierra el menu hamburguesa despues de tocar una opcion
            >
              {cat.nombre}
            </Link>
          ))}
        </nav>

        <div className="actions">
          <form className={`search-form${searchOpen ? " open" : ""}`} onSubmit={submitSearch}>
            <input
              ref={inputRef}
              type="text"
              placeholder="Buscar productos…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onBlur={() => !query && setSearchOpen(false)}
            />
          </form>

          <button
            className="icon-btn"
            aria-label="Buscar"
            onClick={() => setSearchOpen((v) => !v)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          <Link to="/login" className="icon-btn" aria-label="Mi cuenta">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="3.4" />
              <path d="M4.5 20c1.4-3.6 4.2-5.4 7.5-5.4s6.1 1.8 7.5 5.4" />
            </svg>
          </Link>

          <button className="icon-btn" aria-label="Carrito">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 8h12l-1 12H7L6 8Z" />
              <path d="M9 8V6a3 3 0 0 1 6 0v2" />
            </svg>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}