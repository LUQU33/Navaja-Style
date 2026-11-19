import { createContext, useContext, useState } from "react";
import { priceToNumber } from "../utils/price";

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const [items, setItems] = useState([])

    const addItem = ({ product, color, size }) => {
        const key = `${ product.id}-${color ?? ""}-${size ?? ""}`
        setItems((current) => {
            const existing = current.find((i) => i.key === key)
            if (existing) {
                return current.map((i) => 
                    i.key === key ? { ...i, quantity: i.quantity + 1} : i
                );
            }

            return [...current, { key, product, color, size, quantity: 1}]
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
        (sum, i) => sum + priceToNumber(i.product.price) * i.quantity, 0
    );

    return (
        <CartContext.Provider
            value={{ items, count, total, addItem, removeItem, updateQuantity, clearCart }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext)
    if (!ctx) throw new Error("useCart debe usarse dentro de un CartProvider");
    return ctx;
}