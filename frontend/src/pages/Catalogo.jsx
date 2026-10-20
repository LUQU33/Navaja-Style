import { useState  } from "react"
import ProductCard from "../components/ProductCard"
import { PRODUCTS } from "../data/products"
import "./Catalogo.css"

const CATEGORIES = ["Todos", ...new Set(PRODUCTS.map((p) => p.category))];

export default function Catalogo() {
    const [active, setActive] = useState("Todos");

    const visible = 
        active === "Todos"
            ? PRODUCTS
            : PRODUCTS.filter((p) => p.category === active);
    
    return (
        <section className="navaja-catalog">
            <header className="head">
                <div className="eyebrow">Catálogo</div>
                <h1>Todos los productos</h1>
                <span className="count">{visible.length} productos</span>
            </header>

            <div className="filters">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        className={`chip${active === cat ? " active" : ""}`}
                        onClick={() => setActive(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="grid">
                {visible.map((p) => (
                    <ProductCard key={p.id} product={p} />
                ))}
            </div>
        </section>
    );
}