"use client";

import Footer from "@/components/Footer";
import Cart from "@/components/Cart";

export default function CartPage() {
  return (
    <div className="min-h-screen bg-background">
      <h1 className="text-3xl font-bold text-center py-8">Your Cart</h1>
      <Cart />
      <Footer />
    </div>
  );
}
