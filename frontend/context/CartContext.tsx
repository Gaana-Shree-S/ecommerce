"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "@/components/ProductCard";

export interface CartItem extends Product {
  quantity: number;
  deliveryOptionId?: number; 
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string | number) => void;
  clearCart: () => void;
  updateQuantity: (id: string | number, quantity: number) => void;
  updateDeliveryOption: (id: string | number, deliveryOptionId: number) => void;
  isAuthenticated: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Initialize only after client-side mount to prevent hydration issues
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      // Clear orders when server starts (component mounts)
      localStorage.removeItem("orders");
      // Check if user is authenticated
      const user = localStorage.getItem("user");
      setIsAuthenticated(!!user);
    }
  }, []);

  const addToCart = (product: Product) => {
    if (!isClient) return;
    
    setCartItems((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        return prev.map((p) =>
          p.id === product.id
            ? { ...p, quantity: (p.quantity || 1) + 1 }
            : p
        );
      }
      return [
        ...prev,
        { ...product, quantity: 1, deliveryOptionId: 1 }, // default is Standard
      ];
    });
  };

  const removeFromCart = (id: string | number) => {
    if (!isClient) return;
    
    setCartItems((prev) => prev.filter((p) => p.id !== id));
  };

  const clearCart = () => {
    if (!isClient) return;
    
    setCartItems([]);
  };

  const updateQuantity = (id: string | number, quantity: number) => {
    if (!isClient || quantity < 1) return;
    
    setCartItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity } : p))
    );
  };

  const updateDeliveryOption = (id: string | number, deliveryOptionId: number) => {
    if (!isClient) return;
    
    setCartItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, deliveryOptionId } : p))
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
        updateDeliveryOption,
        isAuthenticated,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
