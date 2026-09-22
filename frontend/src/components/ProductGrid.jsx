import ProductCard from "./ProductCard";
import "./ProductGrid.css";

const MOCK_PRODUCTS = [
  { id: 1, name: "Camisa Corte Recto", category: "Colección", price: "$48.000", colors: ["#2b2b2b", "#8a8f98"], badge: "Nuevo" },
  { id: 2, name: "Pantalón Sastrero", category: "Colección", price: "$62.000", colors: ["#2b2b2b", "#4a4e55", "#cdd1d6"] },
  { id: 3, name: "Cinturón Cuero Crudo", category: "Accesorios", price: "$21.500", colors: ["#5a3d2b"] },
  { id: 4, name: "Campera Bomber", category: "Colección", price: "$89.000", colors: ["#2b2b2b"], badge: "Últimas unidades" },
];

export default function ProductGrid({
  products = MOCK_PRODUCTS,
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
        <a className="view-all" href="#catalogo">Ver todo el catálogo</a>
      </div>

      <div className="grid">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}