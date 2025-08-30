"use client";

import { useOrder } from "@/context/OrderContext";
import Footer from "@/components/Footer";

export default function OrdersPage() {
	const { orders } = useOrder();

	return (
		<div className="min-h-screen bg-background">
			<h1 className="text-3xl font-bold text-center py-8">My Orders</h1>
			<div className="max-w-3xl mx-auto p-4">
				{orders.length > 0 ? (
					orders.slice().reverse().map((order, idx) => (
						<div key={idx} className="border rounded-lg p-4 mb-6">
							<h2 className="text-xl font-semibold mb-2">Order placed on {new Date(order.date).toLocaleString()}</h2>
							<ul className="divide-y">
								{order.items.map((item) => (
									<li key={item.id} className="py-2 flex items-center gap-4">
										<img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
										<div>
											<p className="font-medium">{item.name}</p>
											<p>Qty: {item.quantity}</p>
											<p>₹{item.price}</p>
										</div>
									</li>
								))}
							</ul>
							<div className="mt-4">
								<p>Subtotal: ₹{order.subtotal.toFixed(2)}</p>
								<p>Shipping: ₹{order.shipping.toFixed(2)}</p>
								<p>Tax: ₹{order.tax.toFixed(2)}</p>
								<p className="font-bold text-lg">Total: ₹{order.total.toFixed(2)}</p>
							</div>
						</div>
					))
				) : (
					<p className="text-center text-muted-foreground">No orders found. Place an order to see it here.</p>
				)}
			</div>
			<Footer />
		</div>
	);
}
