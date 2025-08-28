/* eslint-disable @next/next/no-img-element */
"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import axios from "axios"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Star } from "lucide-react"

interface Product {
  _id: string
  name: string
  price: number
  originalPrice?: number
  category: string
  image: string
  rating?: number
  inStock: boolean
  description?: string
}

export default function ProductDetailsPage() {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/products/${id}`)
        setProduct(res.data.product)
      } catch (err) {
        console.error("Failed to fetch product:", err)
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchProduct()
  }, [id])

  const handleAddToCart = async () => {
    if (!product) return
    setAdding(true)
    setMessage("")

    try {
      const token = localStorage.getItem("accessToken")
      if (!token) {
        setMessage("Please log in to add items to cart")
        setAdding(false)
        return
      }

      await axios.post(
        "http://localhost:5000/api/cart",
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setMessage("Added to cart!")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Failed to add to cart:", err)
      setMessage("Could not add to cart")
    } finally {
      setAdding(false)
    }
  }

  if (loading) return <p className="text-center py-10">Loading...</p>
  if (!product) return <p className="text-center py-10">Product not found.</p>

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Card className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
        {/* Left Side - Image */}
        <CardContent>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-[28rem] object-cover rounded-lg shadow-md"
          />
        </CardContent>

        {/* Right Side - Details */}
        <CardContent className="flex flex-col justify-between">
          <div>
            {/* Title + Category */}
            <CardHeader className="px-0">
              <CardTitle className="text-3xl font-bold">{product.name}</CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                {product.category}
              </CardDescription>
            </CardHeader>

            {/* Price Section */}
            <div className="mt-4 flex items-center space-x-4">
              <p className="text-3xl font-bold text-primary">
                ₹{product.price.toFixed(2)}
              </p>
              {product.originalPrice && (
                <p className="line-through text-muted-foreground text-lg">
                  ₹{product.originalPrice.toFixed(2)}
                </p>
              )}
            </div>

            {/* Stock Status */}
            <p
              className={`mt-2 text-sm font-medium ${
                product.inStock ? "text-green-600" : "text-red-600"
              }`}
            >
              {product.inStock ? "In Stock" : "Out of Stock"}
            </p>

            {/* Rating */}
            {product.rating && (
              <div className="mt-3 flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.round(product.rating!)
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
                  {product.rating.toFixed(1)} / 5
                </span>
              </div>
            )}

            {/* Description from DB */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Product Description</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.description || "No description available."}
              </p>
            </div>
          </div>

          {/* Actions */}
          <CardFooter className="mt-8 flex flex-col gap-2 px-0">
            <Button
              onClick={handleAddToCart}
              disabled={!product.inStock || adding}
              className="bg-primary text-white w-full py-6 text-lg"
            >
              {adding ? "Adding to Cart..." : "Add to Cart"}
            </Button>
            {message && (
              <p
                className={`text-sm text-center ${
                  message.includes("Added")
                    ? "text-green-600"
                    : message.includes("Please log in")
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  )
}
