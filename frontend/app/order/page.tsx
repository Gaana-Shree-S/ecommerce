"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useOrder } from "@/context/OrderContext";
import dayjs from "dayjs";

export default function OrderPage() {
  const { latestOrder, clearOrder } = useOrder();
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    if (latestOrder) {
      setTimeout(() => setProcessing(false), 2000);
    }
  }, [latestOrder]);

  if (!latestOrder)
    return <p className="p-8 text-center">No recent order found.</p>;

  const getDeliveryDate = (deliveryOptionId?: number) => {
    const days = deliveryOptionId === 2 ? 1 : 3;
    return dayjs().add(days, "day").format("dddd, MMMM D");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 flex flex-col gap-6 items-center">
      {processing ? (
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-blue-500 border-gray-300"></div>
          <p className="text-xl font-semibold">Processing your order...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6 w-full">
          <div className="text-green-600 text-6xl animate-bounce">✔️</div>
          <h1 className="text-3xl font-bold">Order Placed Successfully!</h1>
          <p className="text-lg">
            Order Date: {new Date(latestOrder.date).toLocaleString()}
          </p>

          {/* Order items */}
          <div className="mt-4 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
            {latestOrder.items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 border p-4 rounded items-center"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex flex-col text-left">
                  <p className="font-semibold">{item.name}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: ₹{item.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">
                    Delivery Date: {getDeliveryDate(item.deliveryOptionId)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="mt-4 text-left w-full border-t pt-4">
            <p>Subtotal: ₹{latestOrder.subtotal.toFixed(2)}</p>
            <p>Shipping: ₹{latestOrder.shipping.toFixed(2)}</p>
            <p>Tax: ₹{latestOrder.tax.toFixed(2)}</p>
            <p className="font-bold text-lg">Total: ₹{latestOrder.total.toFixed(2)}</p>
          </div>

          <Button
            className="mt-6"
            onClick={() => {
              clearOrder();
              window.location.href = "/";
            }}
          >
            Back to Home
          </Button>
        </div>
      )}
    </div>
  );
}
