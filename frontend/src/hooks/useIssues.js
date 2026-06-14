import { useState, useEffect } from 'react'
import { fetchIssues } from '../lib/github.js'

export default function useIssues(initialFilters) {
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hasMore, setHasMore] = useState(false)
  const [totalCount, setTotalCount] = useState(0)
  
  // Track current filters and pagination internally or via props
  const [filters, setFilters] = useState({
    language: initialFilters?.language || 'JavaScript',
    skillLevel: initialFilters?.skillLevel || 'beginner',
    page: initialFilters?.page || 1,
    minScore: initialFilters?.minScore || 0,
    labels: initialFilters?.labels || ['good-first-issue'],
    searchQuery: initialFilters?.searchQuery || '',
    // When _applied changes, it triggers a refetch from page 1
    _applied: initialFilters?._applied || Date.now()
  })

  // Whenever filters logic effectively changes (like a new language, skillLevel, or Apply Filters is clicked)
  useEffect(() => {
    let active = true

    const loadInitial = async () => {
      setLoading(true)
      setError(null)
      setIssues([]) // clear previous
      
      const result = await fetchIssues(filters.language, filters.skillLevel, 1, filters.labels, filters.searchQuery)
      
      if (!active) return

      if (result.error) {
        setError(result.error)
      } else {
        // Filter by minScore on the client side since API doesn't support it directly yet
        const filteredData = (result.data || []).filter(issue => 
          (issue.friendliness_score ?? 0) >= filters.minScore
        )
        setIssues(filteredData)
        setHasMore(result.has_more)
        setTotalCount(result.total_count)
        // Reset page to 1 internally if it was changed
        setFilters(prev => ({ ...prev, page: 1 }))
      }
      setLoading(false)
    }

    loadInitial()

    return () => {
      active = false
    }
  }, [filters.language, filters.skillLevel, filters.minScore, filters.labels, filters.searchQuery, filters._applied])

  const fetchMore = async () => {
    setLoading(true)
    setError(null)
    
    const nextPage = filters.page + 1
    const result = await fetchIssues(filters.language, filters.skillLevel, nextPage, filters.labels, filters.searchQuery)
    
    if (result.error) {
      setError(result.error)
    } else {
      const filteredData = (result.data || []).filter(issue => 
        (issue.friendliness_score ?? 0) >= filters.minScore
      )
      setIssues(prev => [...prev, ...filteredData])
      setFilters(prev => ({ ...prev, page: nextPage }))
      setHasMore(result.has_more)
      setTotalCount(result.total_count)
    }
    setLoading(false)
  }

  return { issues, loading, error, hasMore, totalCount, fetchMore, setFilters }
}
