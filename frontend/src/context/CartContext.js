import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem('thrifto_cart');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('thrifto_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, size, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product === product._id && i.size === size);
      if (existing) {
        return prev.map((i) =>
          i.product === product._id && i.size === size ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [
        ...prev,
        {
          product: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          size,
          qty,
        },
      ];
    });
  };

  const removeFromCart = (productId, size) => {
    setCart((prev) => prev.filter((i) => !(i.product === productId && i.size === size)));
  };

  const clearCart = () => setCart([]);

  const totalAmount = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, totalAmount, totalItems }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
