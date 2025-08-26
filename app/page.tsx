"use client"

import { useState } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import ProductCard, { type Product } from "@/components/ProductCard"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Sample product data
const sampleProducts: Product[] = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    price: 6499.99,
    originalPrice: 7999.99,
    image: "/placeholder-nb6yc.png",
    category: "Electronics",
    rating: 4.5,
    inStock: true,
  },
  {
    id: 2,
    name: "Premium Cotton T-Shirt",
    price: 1999.99,
    image: "/premium-cotton-t-shirt.png",
    category: "Clothing",
    rating: 4.2,
    inStock: true,
  },
  {
    id: 3,
    name: "Smart Fitness Watch",
    price: 16499.99,
    originalPrice: 20499.99,
    image: "/smart-fitness-watch.png",
    category: "Electronics",
    rating: 4.7,
    inStock: true,
  },
  {
    id: 4,
    name: "Organic Coffee Beans",
    price: 1549.99,
    image: "/organic-coffee-beans.png",
    category: "Food & Beverage",
    rating: 4.8,
    inStock: false,
  },
  {
    id: 5,
    name: "Leather Laptop Bag",
    price: 7299.99,
    originalPrice: 9999.0,
    image: "/leather-laptop-bag.png",
    category: "Accessories",
    rating: 4.3,
    inStock: true,
  },
  {
    id: 6,
    name: "Wireless Phone Charger",
    price: 2849.99,
    image: "/placeholder-os1yn.png",
    category: "Electronics",
    rating: 4.1,
    inStock: true,
  },
  {
    id: 7,
    name: "Yoga Mat Premium",
    price: 3749.99,
    image: "/premium-yoga-mat.png",
    category: "Sports & Fitness",
    rating: 4.6,
    inStock: true,
  },
  {
    id: 8,
    name: "Stainless Steel Water Bottle",
    price: 1849.99,
    originalPrice: 2449.99,
    image: "/stainless-steel-bottle.png",
    category: "Sports & Fitness",
    rating: 4.4,
    inStock: true,
  },
]

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>(sampleProducts)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(sampleProducts)
  const [cartItems, setCartItems] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("All")

  // Get unique categories
  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))]

  // Handle search functionality
  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredProducts(products)
      return
    }

    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase()),
    )
    setFilteredProducts(filtered)
  }

  // Handle category filter
  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category)
    if (category === "All") {
      setFilteredProducts(products)
    } else {
      setFilteredProducts(products.filter((p) => p.category === category))
    }
  }

  // Handle add to cart
  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => [...prev, product])
    console.log(`Added ${product.name} to cart`)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartItemCount={cartItems.length} onSearch={handleSearch} />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to Swadeshi Mart</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">Discover amazing products at unbeatable prices</p>
          <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            Shop Now
          </Button>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryFilter(category)}
                className={selectedCategory === category ? "bg-primary text-primary-foreground" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-foreground">Featured Products</h2>
            <Badge variant="secondary" className="text-sm">
              {filteredProducts.length} products found
            </Badge>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No products found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
