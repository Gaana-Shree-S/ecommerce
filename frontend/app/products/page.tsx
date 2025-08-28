/* eslint-disable @next/next/no-img-element */
"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

interface Product {
  _id: string
  name: string
  price: number
  originalPrice?: number
  category: string
  image: string
  rating?: number
  inStock: boolean
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/products")
        setProducts(res.data.products)
      } catch (err) {
        console.error("Failed to fetch products:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  if (loading) return <p className="text-center py-10">Loading products...</p>

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card
          key={product._id}
          className="cursor-pointer hover:shadow-lg transition"
          onClick={() => router.push(`/products/${product._id}`)}
        >
          <CardContent className="flex flex-col items-center">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <CardHeader className="w-full">
              <CardTitle>{product.name}</CardTitle>
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
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
