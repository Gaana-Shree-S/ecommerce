"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface OrderItem {
  id: string | number;
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
  orders: OrderData[];
  addOrder: (order: OrderData) => void;
  clearOrders: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<OrderData[]>([]);

  // Clear orders when server starts (component mounts)
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("orders");
      setOrders([]);
    }
  }, []);

  const addOrder = (order: OrderData) => {
    setOrders((prev) => {
      const updated = [...prev, order];
      if (typeof window !== "undefined") {
        localStorage.setItem("orders", JSON.stringify(updated));
      }
      return updated;
    });
  };

  const clearOrders = () => {
    setOrders([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("orders");
    }
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, clearOrders }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error("useOrder must be used inside OrderProvider");
  return context;
};
