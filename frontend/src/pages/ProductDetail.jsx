import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { Link, useParams } from "react-router-dom";
import { obtenerProducto } from "../api/productos";
import { formatearPrecio } from "../utils/formatearPrecio";
import "./ProductDetail.css";

// Quita los repetidos (varias variantes comparten color o talle) usando el id como clave
function unicos(items) {
  return [...new Map(items.map((item) => [item.id, item])).values()];
}

function DetalleProducto({ producto }) {
  const { addItem } = useCart();
  // Guardamos solo los ids elegidos; null significa "sin elegir"
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const { nombre, categoria, precio, descripcion, variantes } = producto;
  const colors = unicos(variantes.map((v) => v.color));
  const sizes = unicos(variantes.map((v) => v.talle)).sort((a, b) => a.orden - b.orden);

  // Si el color elegido no existe usamos el primero por defecto, evita un bug
  const activeColor = colors.find((c) => c.id === selectedColor) ?? colors[0];
  // Aca no tenemos valor por defecto
  const activeSize = sizes.find((s) => s.id === selectedSize) ?? null;

  // El backend solo manda variantes con stock: si la combinacion elegida no esta, no hay stock
  const variante = variantes.find(
    (v) => v.color.id === activeColor?.id && v.talle.id === activeSize?.id
  );
  const sinStock = activeSize !== null && !variante;

  const handleAdd = () => {
    if (!activeSize) {
      setFeedback({ type: "error", text: "Seleccioná un talle para continuar." });
      return;
    }
    addItem({ product: { id: producto.id, nombre, precio }, variante });
    setFeedback({ type: "ok", text: "Agregado al carrito." });
  };

  return (
    <div className="layout">
      <div className="media">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 55 L75 25 C85 20 93 28 88 38 L60 65 L15 55Z" stroke="#8a8f98" strokeWidth="1.4" />
        </svg>
      </div>

      <div className="info">
        <span className="category">{categoria}</span>
        <h1>{nombre}</h1>
        <span className="price">{formatearPrecio(precio)}</span>
        {descripcion && <p className="description">{descripcion}</p>}

        {variantes.length === 0 ? (
          <p className="sold-out">Agotado</p>
        ) : (
          <>
            <div className="option">
              <span className="option-label">Color</span>
              <div className="swatches">
                {colors.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className={`swatch${c.id === activeColor.id ? " active" : ""}`}
                    style={{ background: c.hex }}
                    aria-label={`Color ${c.nombre}`}
                    aria-pressed={c.id === activeColor.id}
                    onClick={() => { setSelectedColor(c.id); setFeedback(null); }}
                  />
                ))}
              </div>
            </div>

            <div className="option">
              <span className="option-label">Talle</span>
              <div className="sizes">
                {sizes.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className={`size${s.id === activeSize?.id ? " active" : ""}`}
                    aria-pressed={s.id === activeSize?.id}
                    onClick={() => { setSelectedSize(s.id); setFeedback(null); }}
                  >
                    {s.nombre}
                  </button>
                ))}
              </div>
            </div>

            <button type="button" className="add-btn" onClick={handleAdd} disabled={sinStock}>
              {sinStock ? "Sin stock" : "Agregar al carrito"}
            </button>
            {feedback && (
              <p className={`feedback ${feedback.type}`} role="status">{feedback.text}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function ProductDetail() {
  // useParams lee el ID de la URL, llega siempre como texto
  const { id } = useParams();
  const [resultado, setResultado] = useState(null);

  const cargando = resultado?.id !== id;
  const producto = resultado?.producto ?? null;
  const error = resultado?.error ?? null;

  useEffect(() => {
    let cancelado = false;

    obtenerProducto(id)
      .then((data) => {
        if (!cancelado) setResultado({ id, producto: data, error: null });
      })
      .catch((e) => {
        if (!cancelado) setResultado({ id, producto: null, error: e.message });
      });

    return () => {
      cancelado = true;
    };
  }, [id]);

  if (cargando) {
    return (
      <section className="navaja-detail">
        <p>Cargando producto...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="navaja-detail">
        <div className="not-found">
          <h1>No se pudo mostrar el producto</h1>
          <p>{error}</p>
          <Link className="back-link" to="/catalogo">Volver al catálogo</Link>
        </div>
      </section>
    );
  }

  // Mientras carga otro producto este componente se desmonta, asi la seleccion arranca limpia
  return (
    <section className="navaja-detail">
      <Link className="back-link" to="/catalogo">← Volver al catálogo</Link>
      <DetalleProducto producto={producto} />
    </section>
  );
}
