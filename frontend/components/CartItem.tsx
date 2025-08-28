"use client";

import { Button } from "@/components/ui/button";
import { useCart, CartItem as CartItemType } from "@/context/CartContext";
import dayjs from "dayjs";

interface CartItemProps {
  item: CartItemType;
}

const deliveryOptions = [
  { id: 1, name: "Standard", days: 3, price: 0 },
  { id: 2, name: "Express", days: 1, price: 150 },
];

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart, updateDeliveryOption } = useCart();

  return (
    <div className="flex flex-col md:flex-row justify-between gap-4 border-b py-4">
      <div className="flex items-center gap-4">
        <img
          src={item.image}
          alt={item.name}
          className="w-16 h-16 object-cover rounded"
        />
        <div>
          <p className="font-semibold">{item.name}</p>
          <p className="text-sm text-muted-foreground">
            ₹{item.price.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
          disabled={(item.quantity || 1) <= 1}
        >
          -
        </Button>
        <span>{item.quantity || 1}</span>
        <Button
          size="sm"
          onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
        >
          +
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => removeFromCart(item.id)}
        >
          Remove
        </Button>
      </div>

      <div className="mt-2 md:mt-0">
        <p className="font-semibold mb-1">Delivery Options:</p>
        {deliveryOptions.map((opt) => {
          const deliveryDate = dayjs().add(opt.days, "day").format(
            "dddd, MMMM D"
          );
          return (
            <label key={opt.id} className="flex items-center gap-2">
              <input
                type="radio"
                name={`delivery-${item.id}`}
                checked={item.deliveryOptionId === opt.id}
                onChange={() => updateDeliveryOption(item.id, opt.id)}
              />
              <span>
                {opt.name} - ₹{opt.price} - {deliveryDate}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
