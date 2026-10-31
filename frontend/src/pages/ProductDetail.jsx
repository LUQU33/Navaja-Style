import { Link, useParams } from "react-router-dom"; 
//UserParams lee el ID, llega como texto y se convierte en Number(id)
// si no existe el ID, muestra un mensaje de error
import { PRODUCTS } from "../data/products";
import "./ProductDetail.css";

export default function ProductDetail() {
  const { id } = useParams();
  const product = PRODUCTS.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <section className="navaja-detail">
        <div className="not-found">
          <h1>Producto no encontrado</h1>
          <p>Puede que ya no este disponible o que el link sea incorrecto.</p>
          <Link className="back-link" to="/catalogo">Volver al catálogo</Link>
        </div>
      </section>
    );
  }

  const { name, category, price, description, badge } = product;

  return (
    <section className="navaja-detail">
      <Link className="back-link" to="/catalogo">← Volver al catálogo</Link>

      <div className="layout">
        <div className="media">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 55 L75 25 C85 20 93 28 88 38 L60 65 L15 55Z" stroke="#8a8f98" strokeWidth="1.4" />
          </svg>
        </div>

        <div className="info">
          {badge && <span className="badge">{badge}</span>}
          <span className="category">{category}</span>
          <h1>{name}</h1>
          <span className="price">{price}</span>
          <p className="description">{description}</p>
        </div>
      </div>
    </section>
  );
}