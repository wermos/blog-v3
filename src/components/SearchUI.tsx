import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, X } from 'lucide-react'

interface SearchResult {
  url: string
  content: string
  word_count: number
  filters: Record<string, string>
  meta: {
    title: string
    image?: string
  }
  excerpt: string
  sub_results: Array<{
    title: string
    url: string
    excerpt: string
  }>
}

export default function SearchUI() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [pagefind, setPagefind] = useState<any>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  // Initialize Pagefind
  useEffect(() => {
    const loadPagefind = async () => {
      try {
        // @ts-ignore
        const pf = await import('/pagefind/pagefind.js')
        setPagefind(pf)
      } catch (error) {
        console.error('Failed to load Pagefind:', error)
      }
    }
    loadPagefind()
  }, [])

  // Perform search
  const performSearch = async (searchQuery: string) => {
    if (!pagefind || !searchQuery.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      const search = await pagefind.search(searchQuery)
      const searchResults = await Promise.all(
        search.results.slice(0, 10).map(async (result: any) => {
          const data = await result.data()
          return data
        })
      )
      setResults(searchResults)
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(query)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query, pagefind])

  const clearSearch = () => {
    setQuery('')
    setResults([])
    searchRef.current?.focus()
  }

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>')
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          ref={searchRef}
          type="text"
          placeholder="Search blog posts, tags, and content..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-10 h-12 text-lg"
          autoFocus
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Searching...</p>
        </div>
      )}

      {/* Results */}
      {!loading && results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Found {results.length} result{results.length !== 1 ? 's' : ''}
            </h2>
            <Badge variant="secondary">{query}</Badge>
          </div>

          {results.map((result, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-3">
                  {/* Title */}
                  <h3 className="text-xl font-semibold">
                    <a 
                      href={result.url}
                      className="text-primary hover:underline"
                      dangerouslySetInnerHTML={{
                        __html: highlightText(result.meta.title, query)
                      }}
                    />
                  </h3>

                  {/* URL */}
                  <p className="text-sm text-muted-foreground">
                    {window.location.origin}{result.url}
                  </p>

                  {/* Excerpt */}
                  <p 
                    className="text-muted-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: highlightText(result.excerpt, query)
                    }}
                  />

                  {/* Tags/Filters */}
                  {Object.entries(result.filters).length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(result.filters).map(([key, value]) => (
                        <Badge key={key} variant="outline" className="text-xs">
                          {value}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Sub-results */}
                  {result.sub_results && result.sub_results.length > 0 && (
                    <div className="ml-4 border-l-2 border-muted pl-4 space-y-2">
                      {result.sub_results.slice(0, 3).map((subResult, subIndex) => (
                        <div key={subIndex} className="text-sm">
                          <a 
                            href={subResult.url}
                            className="text-primary hover:underline font-medium"
                            dangerouslySetInnerHTML={{
                              __html: highlightText(subResult.title, query)
                            }}
                          />
                          <p 
                            className="text-muted-foreground mt-1"
                            dangerouslySetInnerHTML={{
                              __html: highlightText(subResult.excerpt, query)
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* No Results */}
      {!loading && query && results.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No results found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or check for typos.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Search Tips */}
      {!query && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3">Search Tips</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Search for specific topics like "GSoC", "physics", or "anime"</li>
              <li>• Use quotes for exact phrases: "particle physics"</li>
              <li>• Search works across all blog posts and pages</li>
              <li>• Results show relevant excerpts and related sections</li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
