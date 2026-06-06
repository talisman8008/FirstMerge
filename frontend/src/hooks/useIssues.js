import { useState, useEffect } from 'react'
import { fetchIssues } from '../lib/github.js'

export default function useIssues(initialFilters) {
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Track current filters and pagination internally or via props
  const [filters, setFilters] = useState({
    language: initialFilters?.language || 'JavaScript',
    skillLevel: initialFilters?.skillLevel || 'beginner',
    page: initialFilters?.page || 1,
    minScore: initialFilters?.minScore || 0,
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
      
      const result = await fetchIssues(filters.language, filters.skillLevel, filters.page)
      
      if (!active) return

      if (result.error) {
        setError(result.error)
      } else {
        // Filter by minScore on the client side since API doesn't support it directly yet
        const filteredData = (result.data || []).filter(issue => 
          (issue.friendliness_score ?? 0) >= filters.minScore
        )
        setIssues(filteredData)
      }
      setLoading(false)
    }

    loadInitial()

    return () => {
      active = false
    }
  }, [filters.language, filters.skillLevel, filters.minScore, filters._applied])

  const fetchMore = async () => {
    setLoading(true)
    setError(null)
    
    const nextPage = filters.page + 1
    const result = await fetchIssues(filters.language, filters.skillLevel, nextPage)
    
    if (result.error) {
      setError(result.error)
    } else {
      const filteredData = (result.data || []).filter(issue => 
        (issue.friendliness_score ?? 0) >= filters.minScore
      )
      setIssues(prev => [...prev, ...filteredData])
      setFilters(prev => ({ ...prev, page: nextPage }))
    }
    setLoading(false)
  }

  return { issues, loading, error, fetchMore, setFilters }
}
