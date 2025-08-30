
"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";

type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  inStock: boolean;
  rating?: number;
};

type OrderItem = {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  deliveryOptionId?: number;
};

type OrderData = {
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  date: string;
  orderId?: string;
  customerName?: string;
  customerEmail?: string;
};

export default function AdminPage() {
  const { user, isAuthenticated } = useUser();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [showImageGuide, setShowImageGuide] = useState(false);
  const [form, setForm] = useState<{
    name: string;
    price: string;
    category: string;
    image: string;
    description: string;
  }>({
    name: "",
    price: "",
    category: "",
    image: "",
    description: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  // Load products from localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedProducts = localStorage.getItem("adminProducts");
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      }
      
      // Load orders from localStorage
      const savedOrders = localStorage.getItem("orders");
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }
    }
  }, []);

  // Check if user is authenticated and is admin
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin-login");
      return;
    }
    
    if (user?.name !== "Admin") {
      router.push("/");
      return;
    }
  }, [isAuthenticated, user, router]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      // Create new product with unique ID
      const newProduct: Product = {
        id: Date.now().toString(), // Simple unique ID
        name: form.name,
        price: Number(form.price),
        category: form.category,
        image: form.image || "/placeholder.jpg", // Default placeholder if no image
        description: form.description,
        inStock: true,
        rating: 4.5
      };

      // Add to products array
      const updatedProducts = [...products, newProduct];
      setProducts(updatedProducts);
      
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("adminProducts", JSON.stringify(updatedProducts));
      }
      
      // Clear the form
      setForm({ name: "", price: "", category: "", image: "", description: "" });
      
      setMessage("Product added successfully!");
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Failed to add product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = (productId: string) => {
    const updatedProducts = products.filter(p => p.id !== productId);
    setProducts(updatedProducts);
    
    if (typeof window !== "undefined") {
      localStorage.setItem("adminProducts", JSON.stringify(updatedProducts));
    }
    
    setMessage("Product deleted successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  const getTotalRevenue = () => {
    return orders.reduce((total, order) => total + order.total, 0);
  };

  const getTotalOrders = () => {
    return orders.length;
  };

  // Show loading while checking authentication
  if (!isAuthenticated || user?.name !== "Admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-blue-500 border-gray-300 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto mt-10 p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-600">Total Products</h3>
            <p className="text-3xl font-bold text-primary">{products.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-600">Total Orders</h3>
            <p className="text-3xl font-bold text-green-600">{getTotalOrders()}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-600">Total Revenue</h3>
            <p className="text-3xl font-bold text-blue-600">₹{getTotalRevenue().toFixed(2)}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'products' 
                ? 'bg-primary text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Products Management
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'orders' 
                ? 'bg-primary text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Orders Management
          </button>
        </div>

        {message && (
          <div className={`p-3 rounded mb-4 text-center ${
            message.includes("successfully") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {message}
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <>
            <div className="bg-white rounded shadow p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-center">Add Product</h2>
                <button
                  onClick={() => setShowImageGuide(!showImageGuide)}
                  className="text-blue-600 hover:text-blue-800 text-sm underline"
                >
                  {showImageGuide ? "Hide" : "Show"} Image URL Guide
                </button>
              </div>

              {showImageGuide && (
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <h3 className="font-semibold mb-2">📸 Image URL Examples:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium mb-1">🌐 External URLs:</p>
                      <ul className="space-y-1 text-xs">
                        <li>• https://picsum.photos/400/300</li>
                        <li>• https://via.placeholder.com/400x300</li>
                        <li>• https://images.unsplash.com/photo-1505740420928-5e560c06d30e</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium mb-1">📁 Local Images:</p>
                      <ul className="space-y-1 text-xs">
                        <li>• /leather-laptop-bag.png</li>
                        <li>• /organic-coffee-beans.png</li>
                        <li>• /premium-cotton-t-shirt.png</li>
                        <li>• /smart-fitness-watch.png</li>
                      </ul>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    💡 Tip: Leave empty to use default placeholder image
                  </p>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    name="name" 
                    value={form.name} 
                    onChange={handleChange} 
                    placeholder="Product Name" 
                    className="border p-2 rounded" 
                    required 
                    disabled={isSubmitting}
                  />
                  <input 
                    name="price" 
                    value={form.price} 
                    onChange={handleChange} 
                    placeholder="Price" 
                    type="number" 
                    step="0.01"
                    min="0"
                    className="border p-2 rounded" 
                    required 
                    disabled={isSubmitting}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    name="category" 
                    value={form.category} 
                    onChange={handleChange} 
                    placeholder="Category" 
                    className="border p-2 rounded" 
                    required 
                    disabled={isSubmitting}
                  />
                  <input 
                    name="image" 
                    value={form.image} 
                    onChange={handleChange} 
                    placeholder="Image URL (optional)" 
                    className="border p-2 rounded" 
                    disabled={isSubmitting}
                  />
                </div>
                <textarea 
                  name="description" 
                  value={form.description} 
                  onChange={handleChange} 
                  placeholder="Description" 
                  className="border p-2 rounded" 
                  rows={3}
                  disabled={isSubmitting}
                />
                <button 
                  type="submit" 
                  className="bg-primary text-white py-2 rounded font-semibold disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Adding Product..." : "Add Product"}
                </button>
              </form>
            </div>
            
            <div className="bg-white rounded shadow p-6">
              <h2 className="text-xl font-bold mb-4">Products ({products.length})</h2>
              {products.length === 0 ? (
                <p className="text-center text-gray-500">No products added yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div key={product.id} className="border rounded p-4 relative">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-32 object-cover mb-2 rounded"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.jpg";
                        }}
                      />
                      <h3 className="font-bold text-lg">{product.name}</h3>
                      <p className="text-lg font-semibold text-primary">₹{product.price.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">{product.category}</p>
                      {product.description && (
                        <p className="text-sm text-muted-foreground mt-2">{product.description}</p>
                      )}
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        title="Delete product"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded shadow p-6">
            <h2 className="text-xl font-bold mb-4">Orders ({orders.length})</h2>
            {orders.length === 0 ? (
              <p className="text-center text-gray-500">No orders found.</p>
            ) : (
              <div className="space-y-6">
                {orders.slice().reverse().map((order, idx) => (
                  <div key={idx} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">Order #{idx + 1}</h3>
                        <p className="text-sm text-gray-600">
                          Placed on: {new Date(order.date).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">₹{order.total.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">{order.items.length} items</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {order.items.map((item, itemIdx) => (
                        <div key={itemIdx} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-12 h-12 object-cover rounded"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.jpg";
                            }}
                          />
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>₹{order.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping:</span>
                        <span>₹{order.shipping.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax:</span>
                        <span>₹{order.tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span>₹{order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
