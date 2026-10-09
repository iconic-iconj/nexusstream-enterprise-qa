import React, { createContext, useContext, useState, useEffect } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
}

interface CartContextType {
  items: Product[];
  addItem: (product: any) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  // 1. Lazy initialize state from localStorage
  const [items, setItems] = useState<Product[]>(() => {
    const savedCart = localStorage.getItem('nexus_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // 2. Persist to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('nexus_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product: any) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      const available = typeof product.stock === 'number' ? product.stock : Infinity;
      if (existing) {
        // Prevent exceeding available stock
        if (existing.quantity + 1 > available) return prev;
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      if (available <= 0) return prev;
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeItem = (id: number) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const clearCart = () => setItems([]);

  const totalPrice = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) throw new Error('useCart must be used within a CartProvider');
  return context;
}