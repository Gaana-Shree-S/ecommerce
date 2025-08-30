"use client"

import { useState, useEffect } from "react"
import { useUser } from "@/context/UserContext"
import { useCart } from "@/context/CartContext"
import { ShoppingCart, User, Menu, X, LogOut, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import SearchBar from "./SearchBar"
import Link from "next/link"   
import { useRouter } from "next/navigation"

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const { user, isAuthenticated, logout } = useUser()
  const { cartItems } = useCart()
  const router = useRouter()

  // Prevent hydration mismatch by only rendering after client-side mount
  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleUserAction = () => {
    if (isAuthenticated) {
      logout()
      router.push("/")
    } else {
      router.push("/auth")
    }
  }

  const handleSearch = (query: string) => {
    // For now, just navigate to home page with search query
    // In a real app, you might want to use a search context or URL params
    if (query.trim()) {
      router.push(`/?search=${encodeURIComponent(query)}`)
    } else {
      router.push("/")
    }
  }

  // Show loading state during hydration
  if (!isClient) {
    return (
      <nav className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <Link href="/" className="text-2xl font-bold">Swadeshi Mart</Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/admin-login" className="hover:bg-primary/80 px-3 py-2 rounded-md text-sm font-medium transition-colors">Admin</Link>
                <Link href="/" className="hover:bg-primary/80 px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</Link>
                <Link href="/products" className="hover:bg-primary/80 px-3 py-2 rounded-md text-sm font-medium transition-colors">Products</Link>
                <Link href="/categories" className="hover:bg-primary/80 px-3 py-2 rounded-md text-sm font-medium transition-colors">Categories</Link>
                <Link href="/orders" className="hover:bg-primary/80 px-3 py-2 rounded-md text-sm font-medium transition-colors">My Orders</Link>
              </div>
            </div>
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <SearchBar onSearch={handleSearch} />
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary/80">
                <User className="h-5 w-5" />
                <span className="hidden sm:ml-2 sm:inline">Login</span>
              </Button>
              <Link href="/cart">
                <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary/80 relative">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="hidden sm:ml-2 sm:inline">Cart</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold">Swadeshi Mart</Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {!isAuthenticated && (
                <Link href="/admin-login" className="hover:bg-primary/80 px-3 py-2 rounded-md text-sm font-medium transition-colors">Admin</Link>
              )}
              {isAuthenticated && user?.name === "Admin" && (
                <Link href="/admin" className="hover:bg-primary/80 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1">
                  <Settings className="h-4 w-4" />
                  Admin Panel
                </Link>
              )}
              <Link href="/" className="hover:bg-primary/80 px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</Link>
              <Link href="/products" className="hover:bg-primary/80 px-3 py-2 rounded-md text-sm font-medium transition-colors">Products</Link>
              <Link href="/categories" className="hover:bg-primary/80 px-3 py-2 rounded-md text-sm font-medium transition-colors">Categories</Link>
              <Link href="/orders" className="hover:bg-primary/80 px-3 py-2 rounded-md text-sm font-medium transition-colors">My Orders</Link>
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-primary-foreground hover:bg-primary/80"
              onClick={handleUserAction}
            >
              {isAuthenticated ? (
                <>
                  <User className="h-5 w-5" />
                  <span className="hidden sm:ml-2 sm:inline">{user?.name}</span>
                  <LogOut className="h-4 w-4 ml-1" />
                </>
              ) : (
                <>
                  <User className="h-5 w-5" />
                  <span className="hidden sm:ml-2 sm:inline">Login</span>
                </>
              )}
            </Button>

            <Link href="/cart">
              <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary/80 relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
                <span className="hidden sm:ml-2 sm:inline">Cart</span>
              </Button>
            </Link>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-primary-foreground hover:bg-primary/80"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-primary/95">
            {!isAuthenticated && (
              <Link href="/admin-login" className="block hover:bg-primary/80 px-3 py-2 rounded-md text-base font-medium">
                Admin Login
              </Link>
            )}
            {isAuthenticated && user?.name === "Admin" && (
              <Link href="/admin" className="block hover:bg-primary/80 px-3 py-2 rounded-md text-base font-medium">
                Admin Panel
              </Link>
            )}
            <Link href="/" className="block hover:bg-primary/80 px-3 py-2 rounded-md text-base font-medium">
              Home
            </Link>
            <Link href="/products" className="block hover:bg-primary/80 px-3 py-2 rounded-md text-base font-medium">
              Products
            </Link>
            <Link href="/categories" className="block hover:bg-primary/80 px-3 py-2 rounded-md text-base font-medium">
              Categories
            </Link>
            <button 
              onClick={handleUserAction}
              className="block w-full text-left hover:bg-primary/80 px-3 py-2 rounded-md text-base font-medium"
            >
              {isAuthenticated ? `Logout (${user?.name})` : "Login"}
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
