/* eslint-disable @next/next/no-img-element */
"use client"

import { useState } from "react"
import { ShoppingCart, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  rating?: number
  inStock: boolean
}


interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleAddToCart = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (onAddToCart) {
      onAddToCart(product)
    }
    setIsLoading(false)
  }

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border bg-card">
      <CardContent className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground">-{discountPercentage}%</Badge>
          )}

          {/* Wishlist Button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 bg-background/80 hover:bg-background text-foreground"
            onClick={() => setIsWishlisted(!isWishlisted)}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
          </Button>

          {/* Stock Status */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive">Out of Stock</Badge>
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="mb-2">
            <Badge variant="secondary" className="text-xs">
              {product.category}
            </Badge>
          </div>

          <h3 className="font-semibold text-card-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-bold text-primary">₹{product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">₹{product.originalPrice.toFixed(2)}</span>
            )}
          </div>

          {product.rating && (
            <div className="flex items-center gap-1 mb-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-sm ${i < Math.floor(product.rating!) ? "text-yellow-400" : "text-gray-300"}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-xs text-muted-foreground">({product.rating})</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          disabled={!product.inStock || isLoading}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {isLoading ? "Adding..." : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  )
}
