import { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';
import { listarProductos } from '../api/productos';

const CANTIDAD_DESTACADOS = 4;

export default function Home() {
    const [resultado, setResultado] = useState(null);

    useEffect(() => {
        listarProductos()
            .then((data) => setResultado({ productos: data.slice(0, CANTIDAD_DESTACADOS), error: null }))
            .catch((e) => setResultado({ productos: [], error: e.message }));
    }, []);

    return (
        <>
            <Hero />
            {resultado?.error && <p>{resultado.error}</p>}
            {resultado && !resultado.error && <ProductGrid products={resultado.productos} />}
        </>
    );
}
// Considerar agregar estado 'cargando' para mostrar un spinner mientras se cargan los productos.