/* eslint-disable @next/next/no-img-element */
"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/CartContext"

interface Product {
  _id?: string
  id?: string
  name: string
  price: number
  originalPrice?: number
  category: string
  image: string
  rating?: number
  inStock: boolean
  description?: string
}

export default function ProductsPage() {
  const [backendProducts, setBackendProducts] = useState<Product[]>([])
  const [adminProducts, setAdminProducts] = useState<Product[]>([])
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch backend products
        const res = await axios.get("http://localhost:3001/api/products")
        const backendData = res.data.products.map((p: any) => ({
          ...p,
          id: p._id,   
        }))
        setBackendProducts(backendData)
        
        // Load admin products from localStorage
        if (typeof window !== "undefined") {
          const savedAdminProducts = localStorage.getItem("adminProducts")
          if (savedAdminProducts) {
            const adminData = JSON.parse(savedAdminProducts)
            setAdminProducts(adminData)
          }
        }
      } catch (err) {
        console.error("Failed to fetch products:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  // Combine backend and admin products
  useEffect(() => {
    const combined = [...backendProducts, ...adminProducts]
    setAllProducts(combined)
  }, [backendProducts, adminProducts])

  const handleAddToCart = (product: Product) => {
    addToCart(product)
    console.log(`Added ${product.name} to cart`)
  }

  if (loading) return <p className="text-center py-10">Loading products...</p>

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">All Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {allProducts.map((product) => (
          <Card
            key={product._id || product.id}
            className="cursor-pointer hover:shadow-lg transition"
          >
            <CardContent className="p-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded mb-4"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.jpg";
                }}
              />
              <CardHeader className="p-0">
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <CardDescription>{product.category}</CardDescription>
              </CardHeader>
              <div className="flex flex-col items-start w-full mt-2">
                <p className="text-lg font-semibold text-primary">₹{product.price.toFixed(2)}</p>
                {product.originalPrice && (
                  <p className="text-sm line-through text-muted-foreground">
                    ₹{product.originalPrice.toFixed(2)}
                  </p>
                )}
                <p className="text-sm mt-1">{product.inStock ? "In Stock" : "Out of Stock"}</p>
                {product.description && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{product.description}</p>
                )}
                <div className="flex gap-2 mt-3 w-full">
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => router.push(`/products/${product._id || product.id}`)}
                  >
                    View Details
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {allProducts.length === 0 && (
        <p className="text-center text-gray-500 py-10">No products available.</p>
      )}
    </div>
  )
}
