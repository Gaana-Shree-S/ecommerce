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
  const { user } = useUser();
  const { setLatestOrder } = useOrder();
  const router = useRouter();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

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
    if (!user) {
      alert("Please login/register to checkout!");
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

    // Save order in context & localStorage
    setLatestOrder(orderData);

    
    setTimeout(() => {
      clearCart();
      router.push("/order"); 
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col gap-4">
      {isPlacingOrder ? (
        <div className="flex flex-col items-center gap-4 p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-blue-500 border-gray-300"></div>
          <p className="text-xl font-semibold">Placing Your Order...</p>
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
              <Button onClick={handleCheckout}>Checkout</Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
