import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { obtenerProducto } from "../api/productos";
import { formatearPrecio } from "../utils/formatearPrecio";
import "./ProductoDetalle.css";

// Quita los repetidos (varias variantes comparten color o talle) usando el id como clave
function unicos(items) {
    return [...new Map(items.map((item) => [item.id, item])).values()];
}

function SelectorVariantes({ variantes }) {
    // El value de un <select> siempre es string; "" significa "sin elegir"
    const [colorId, setColorId] = useState("");
    const [talleId, setTalleId] = useState("");

    const colores = unicos(variantes.map((v) => v.color));
    const talles = unicos(variantes.map((v) => v.talle)).sort((a, b) => a.orden - b.orden);

    // El backend solo manda variantes con stock: si la combinacion elegida no esta, no hay stock
    const variante = variantes.find(
        (v) => String(v.color.id) === colorId && String(v.talle.id) === talleId
    );
    const sinStock = colorId !== "" && talleId !== "" && !variante;

    return (
        <div className="selector">
            <label className="field">
                Color
                <select value={colorId} onChange={(e) => setColorId(e.target.value)}>
                    <option value="">Elegí un color</option>
                    {colores.map((c) => (
                        <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                </select>
            </label>

            <label className="field">
                Talle
                <select value={talleId} onChange={(e) => setTalleId(e.target.value)}>
                    <option value="">Elegí un talle</option>
                    {talles.map((t) => (
                        <option key={t.id} value={t.id}>{t.nombre}</option>
                    ))}
                </select>
            </label>

            <button className="add-to-cart" disabled={!variante}>
                {sinStock ? "Sin stock" : "Agregar al carrito"}
            </button>
        </div>
    );
}

export default function ProductoDetalle() {
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

    return (
        <section className="navaja-detail">
            <Link className="back" to="/catalogo">← Volver al catálogo</Link>

            {cargando && <p>Cargando producto...</p>}
            {!cargando && error && <p>{error}</p>}

            {!cargando && producto && (
                <div className="content">
                    <div className="media">
                        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 55 L75 25 C85 20 93 28 88 38 L60 65 L15 55Z" stroke="#8a8f98" strokeWidth="1.4" />
                        </svg>
                    </div>

                    <div className="info">
                        <span className="category">{producto.categoria}</span>
                        <h1>{producto.nombre}</h1>
                        <span className="price">{formatearPrecio(producto.precio)}</span>
                        {producto.descripcion && <p className="description">{producto.descripcion}</p>}

                        {producto.variantes.length === 0 ? (
                            <p className="sold-out">Agotado</p>
                        ) : (
                            <SelectorVariantes variantes={producto.variantes} />
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}
