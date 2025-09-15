"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FaSearch, FaTimes, FaClock } from "react-icons/fa"
import { getSearchSuggestions } from "@/lib/products"

interface SearchAutocompleteProps {
  value: string
  onChange: (value: string) => void
  onSearch: (query: string) => void
  placeholder?: string
}

export function SearchAutocomplete({
  value,
  onChange,
  onSearch,
  placeholder = "Search products...",
}: SearchAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("eazybuy-recent-searches")
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // Get suggestions when input changes
  useEffect(() => {
    if (value.length >= 2) {
      const newSuggestions = getSearchSuggestions(value)
      setSuggestions(newSuggestions)
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(value.length === 0 && recentSearches.length > 0)
    }
  }, [value, recentSearches])

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearch = (query: string) => {
    if (query.trim()) {
      // Add to recent searches
      const updated = [query, ...recentSearches.filter((s) => s !== query)].slice(0, 5)
      setRecentSearches(updated)
      localStorage.setItem("eazybuy-recent-searches", JSON.stringify(updated))

      onSearch(query)
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion)
    handleSearch(suggestion)
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem("eazybuy-recent-searches")
  }

  return (
    <div className="relative">
      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch(value)
            }
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder}
          className="pl-10 pr-10"
        />
        {value && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onChange("")
              onSearch("")
            }}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          >
            <FaTimes className="h-3 w-3" />
          </Button>
        )}
      </div>

      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {value.length >= 2 && suggestions.length > 0 && (
            <div>
              <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b">Suggestions</div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-3 py-2 text-left hover:bg-muted transition-colors"
                >
                  <FaSearch className="inline h-3 w-3 mr-2 text-muted-foreground" />
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {value.length === 0 && recentSearches.length > 0 && (
            <div>
              <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b flex items-center justify-between">
                Recent Searches
                <Button variant="ghost" size="sm" onClick={clearRecentSearches} className="h-auto p-0 text-xs">
                  Clear
                </Button>
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(search)}
                  className="w-full px-3 py-2 text-left hover:bg-muted transition-colors"
                >
                  <FaClock className="inline h-3 w-3 mr-2 text-muted-foreground" />
                  {search}
                </button>
              ))}
            </div>
          )}

          {value.length >= 2 && suggestions.length === 0 && (
            <div className="px-3 py-2 text-sm text-muted-foreground">No suggestions found</div>
          )}
        </div>
      )}
    </div>
  )
}
