import React, { createContext, useEffect, useState } from 'react';

export const cartContextObj = createContext();

function CartContext({ children }) {
  const [cart, setCart] = useState({});
  const [cartReady, setCartReady] = useState(false); 

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (err) {
        console.error('Invalid cart JSON:', err);
      }
    }
    setCartReady(true); 
  }, []);

  useEffect(() => {
    if (cartReady) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, cartReady]);

  function addToCart(item) {
    setCart(prev => ({
      ...prev,
      [item._id]: {
        ...item,
        quantity: (prev[item._id]?.quantity || 0) + 1,
      },
    }));
  }

  function removeCart(itemId) {
    setCart(prev => {
      const updated = { ...prev };
      if (updated[itemId]?.quantity > 1) {
        updated[itemId].quantity -= 1;
      } else {
        delete updated[itemId];
      }
      return updated;
    });
  }

  function clearCart() {
    setCart({});
  }


  function getTotalAmount() {
    return Object.values(cart).reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  return (
    <cartContextObj.Provider value={{ cart, addToCart, removeCart, getTotalAmount, cartReady,clearCart }}>
      {children}
    </cartContextObj.Provider>
  );
}

export default CartContext;
