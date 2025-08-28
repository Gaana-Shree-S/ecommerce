"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
   deliveryOptionId?: number;
}

export interface OrderData {
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  date: string;
}

interface OrderContextType {
  latestOrder: OrderData | null;
  setLatestOrder: (order: OrderData) => void;
  clearOrder: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [latestOrder, setLatestOrderState] = useState<OrderData | null>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("latestOrder");
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  });

  const setLatestOrder = (order: OrderData) => {
    setLatestOrderState(order);
    if (typeof window !== "undefined") {
      localStorage.setItem("latestOrder", JSON.stringify(order));
    }
  };

  const clearOrder = () => {
    setLatestOrderState(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("latestOrder");
    }
  };

  return (
    <OrderContext.Provider value={{ latestOrder, setLatestOrder, clearOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error("useOrder must be used inside OrderProvider");
  return context;
};
