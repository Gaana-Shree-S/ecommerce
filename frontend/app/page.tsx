"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import ProductCard, { type Product } from "@/components/ProductCard"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [cartItems, setCartItems] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/products")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = res.data.products.map((p: any) => ({
        ...p,
        id: p._id,   
      }))
      setProducts(data)
      setFilteredProducts(data)
    } catch (err) {
      console.error("Failed to fetch products:", err)
    } finally {
      setLoading(false)
    }
  }
  fetchProducts()
}, [])

  // derive categories dynamically
  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))]

  // Handle search
  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredProducts(products)
      return
    }
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
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
              {loading ? "Loading..." : `${filteredProducts.length} products found`}
            </Badge>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No products found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id || product.id} product={product} onAddToCart={handleAddToCart} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
