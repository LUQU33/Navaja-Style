import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { listarCategorias } from "../api/categorias";
import { listarProductos } from "../api/productos";
import "./Catalogo.css";

export default function Catalogo() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [categorias, setCategorias] = useState([]);
    const [errorCategorias, setErrorCategorias] = useState(null);
    const [resultado, setResultado] = useState(null);

    const categoriaId = Number(searchParams.get("categoria")) || null;

    const cargando = resultado?.categoriaId !== categoriaId;
    const productos = resultado?.productos ?? [];
    const error = resultado?.error ?? null;

    // Traemos las categorias del backend y las guardamos en el estado
    useEffect(() => {
        listarCategorias()
            .then(setCategorias)
            .catch((e) => setErrorCategorias(e.message));
    }, []);

    // Traemos los productos del backend y los guardamos en el estado
    useEffect(() => {
        let cancelado = false;

        listarProductos(categoriaId)
            .then((data) => {
                if (!cancelado) setResultado({ categoriaId, productos: data, error: null });
            })
            .catch((e) => {
                if (!cancelado) setResultado({ categoriaId, productos: [], error: e.message });
            });

        return () => {
            cancelado = true;
        };
    }, [categoriaId]);

    // Función para cambiar la categoría seleccionada y actualizar los parámetros de búsqueda
    const selectCategory = (id) => {
        if (id === null) setSearchParams({});
        else setSearchParams({ categoria: id });
    };

    return (
        <section className="navaja-catalog">
            <header className="head">
                <div className="eyebrow">Catálogo</div>
                <h1>Todos los productos</h1>
                {!cargando && !error && (
                    <span className="count">{productos.length} productos</span>
                )}
            </header>

            <div className="filters">
                <button
                    className={`chip${categoriaId === null ? " active" : ""}`}
                    onClick={() => selectCategory(null)}
                >
                    Todos
                </button>
                {categorias.map((cat) => (
                    <button
                        key={cat.id}
                        className={`chip${categoriaId === cat.id ? " active" : ""}`}
                        onClick={() => selectCategory(cat.id)}
                    >
                        {cat.nombre}
                    </button>
                ))}
            </div>
            {errorCategorias && <p>{errorCategorias}</p>}

            {cargando && <p>Cargando productos...</p>}
            {!cargando && error && <p>{error}</p>}

            {!cargando && !error && (
                <div className="grid">
                    {productos.map((p) => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                </div>
            )}
        </section>
    );
}
