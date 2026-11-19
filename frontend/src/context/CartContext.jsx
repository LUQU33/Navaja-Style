import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const [items, setItems] = useState([])

    // La variante (color + talle) identifica el producto concreto que se compra
    const addItem = ({ product, variante }) => {
        const key = variante.id
        setItems((current) => {
            const existing = current.find((i) => i.key === key)
            if (existing) {
                return current.map((i) =>
                    i.key === key ? { ...i, quantity: i.quantity + 1} : i
                );
            }

            return [...current, { key, product, color: variante.color, size: variante.talle, quantity: 1}]
        });
    }
    const removeItem = (key) => 
        setItems((current) => current.filter((i) => i.key !== key));

    const updateQuantity = (key, quantity) => {
        if (quantity < 1) return removeItem(key);
        setItems((current) => 
            current.map((i) => (i.key === key ? { ...i, quantity } : i))
        );
    }

    const clearCart = () => setItems([])

    const count = items.reduce((sum, i) => sum + i.quantity, 0)
    const total = items.reduce(
        (sum, i) => sum + Number(i.product.precio) * i.quantity, 0
    );

    return (
        <CartContext.Provider
            value={{ items, count, total, addItem, removeItem, updateQuantity, clearCart }}
        >
            {children}
        </CartContext.Provider>
    );
}

// Provider y hook conviven en este archivo (igual que AuthContext en TP3)
// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
    const ctx = useContext(CartContext)
    if (!ctx) throw new Error("useCart debe usarse dentro de un CartProvider");
    return ctx;
}