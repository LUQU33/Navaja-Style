import { Link } from "react-router-dom";
import { formatearPrecio } from "../utils/formatearPrecio";
import "./ProductCard.css";

export default function ProductCard({ product }) {
  const { id, nombre, categoria, precio } = product;

  return (
    <article className="navaja-card">
      <div className="media">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 55 L75 25 C85 20 93 28 88 38 L60 65 L15 55Z" stroke="#8a8f98" strokeWidth="1.4" />
        </svg>
        <button className="quick-add">Agregar rápido</button>
      </div>

      <div className="info">
        <span className="category">{categoria}</span>
        <h3 className="name"><Link to={`/producto/${id}`}>{nombre}</Link></h3>
        <div className="row-bottom">
          <span className="price">{formatearPrecio(precio)}</span>
        </div>
      </div>
    </article>
  );
}
