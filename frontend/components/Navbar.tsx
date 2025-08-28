"use client"

import { useState } from "react"
import { ShoppingCart, User, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import SearchBar from "./SearchBar"
import Link from "next/link"   

interface NavbarProps {
  cartItemCount?: number
  onSearch?: (query: string) => void
}

export default function Navbar({ cartItemCount = 0, onSearch }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
              <Link href="/" className="hover:bg-primary/80 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Home
              </Link>
              <Link href="/products" className="hover:bg-primary/80 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Products
              </Link>
              <Link href="/categories" className="hover:bg-primary/80 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Categories
              </Link>
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <SearchBar onSearch={onSearch} />
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary/80">
              <User className="h-5 w-5" />
              <span className="hidden sm:ml-2 sm:inline">Login</span>
            </Button>

            <Link href="/cart">
              <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary/80 relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
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
          <SearchBar onSearch={onSearch} />
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-primary/95">
            <Link href="/" className="block hover:bg-primary/80 px-3 py-2 rounded-md text-base font-medium">
              Home
            </Link>
            <Link href="/products" className="block hover:bg-primary/80 px-3 py-2 rounded-md text-base font-medium">
              Products
            </Link>
            <Link href="/categories" className="block hover:bg-primary/80 px-3 py-2 rounded-md text-base font-medium">
              Categories
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
