import { useSearchParams  } from "react-router-dom"
import ProductCard from "../components/ProductCard"
import { PRODUCTS } from "../data/products"
import "./Catalogo.css"

const CATEGORIES = ["Todos", ...new Set(PRODUCTS.map((p) => p.category))];

export default function Catalogo() {
    const [searchParams, setSearchParams] = useSearchParams();

    const param = searchParams.get("categoria");
    const active = CATEGORIES.includes(param) ? param : "Todos";

    const selectCategory = (cat) => {
        if (cat === "Todos") setSearchParams({});
        else setSearchParams({ categoria: cat });
    };

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
                        onClick={() => selectCategory(cat)}
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