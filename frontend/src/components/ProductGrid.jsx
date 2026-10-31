import { Link } from "react-router-dom"
import ProductCard from "./ProductCard";
import { PRODUCTS } from "../data/products";
import "./ProductGrid.css";

export default function ProductGrid({
  products = PRODUCTS.slice(0, 4),
  title = "Destacados",
  eyebrow = "Selección de la semana",
}) {
  return (
    <section className="navaja-grid-section">
      <div className="head">
        <div>
          <div className="eyebrow">{eyebrow}</div>
          <h2>{title}</h2>
        </div>
        <Link className="view-all" to="/catalogo">Ver todo el catálogo</Link>
      </div>

      <div className="grid">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}