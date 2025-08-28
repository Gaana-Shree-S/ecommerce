"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
  onSearch?: (query: string) => void
  placeholder?: string
}

export default function SearchBar({ onSearch, placeholder = "Search products..." }: SearchBarProps) {
  const [query, setQuery] = useState("")

  // Real-time search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (onSearch) {
        onSearch(query)
      }
    }, 300) // 300ms debounce

    return () => clearTimeout(timeoutId)
  }, [query, onSearch])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(query)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center w-full">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-4 bg-background text-foreground border-border focus:ring-2 focus:ring-ring"
        />
      </div>
      <Button type="submit" size="sm" className="ml-2 bg-accent hover:bg-accent/90 text-accent-foreground">
        Search
      </Button>
    </form>
  )
}
