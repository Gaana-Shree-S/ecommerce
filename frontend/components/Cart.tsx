"use client";
import { useState, useEffect } from "react"; 
import CartItem from "./CartItem";
import { useCart } from "@/context/CartContext";
import { useOrder } from "@/context/OrderContext";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";

export default function Cart() {
  const { cartItems, clearCart } = useCart();
  const { user, isAuthenticated } = useUser();
  const { addOrder } = useOrder();
  const router = useRouter();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Check authentication when component mounts
  useEffect(() => {
    if (!isAuthenticated && cartItems.length > 0) {
      // If user is not authenticated and has items in cart, redirect to login
      router.push("/auth");
    }
  }, [isAuthenticated, cartItems.length, router]);

  if (!cartItems.length && !isPlacingOrder)
    return <p className="p-8 text-center">Your cart is empty.</p>;

  let subtotal = 0;
  let shipping = 0;

  cartItems.forEach((item) => {
    subtotal += item.price * (item.quantity || 1);
    shipping += item.deliveryOptionId === 2 ? 150 : 0;
  });

  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      alert("You must login to place an order.");
      router.push("/auth");
      return;
    }

    setIsPlacingOrder(true);

    const orderData = {
      items: cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
        image: item.image,
        deliveryOptionId: item.deliveryOptionId || 1,
      })),
      subtotal,
      shipping,
      tax,
      total,
      date: new Date().toISOString(),
    };

    addOrder(orderData);
    
    // Show success message
    setTimeout(() => {
      setOrderSuccess(true);
      clearCart();
      setTimeout(() => {
        router.push("/orders");
      }, 2000);
    }, 1000);
  };

  if (orderSuccess) {
    return (
      <div className="max-w-4xl mx-auto p-4 flex flex-col items-center gap-4">
        <div className="text-center p-8">
          <div className="text-green-500 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-green-700 mb-2">Order Placed Successfully!</h2>
          <p className="text-gray-600 mb-4">Your order has been confirmed and will be processed soon.</p>
          <p className="text-sm text-gray-500">Redirecting to your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col gap-4">
      {isPlacingOrder ? (
        <div className="flex flex-col items-center gap-4 p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-blue-500 border-gray-300"></div>
          <p className="text-xl font-semibold">Placing Your Order...</p>
          <p className="text-gray-600">Please wait while we process your order.</p>
        </div>
      ) : (
        <>
          {cartItems.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}

          <div className="border-t pt-4 flex flex-col gap-2">
            <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
            <p>Shipping: ₹{shipping.toFixed(2)}</p>
            <p>Tax (10%): ₹{tax.toFixed(2)}</p>
            <p className="font-bold text-lg">Total: ₹{total.toFixed(2)}</p>

            <div className="flex gap-2 mt-2">
              <Button variant="destructive" onClick={clearCart}>
                Clear Cart
              </Button>
              <Button onClick={handleCheckout} disabled={!isAuthenticated}>
                {isAuthenticated ? "Checkout" : "Login to Checkout"}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
