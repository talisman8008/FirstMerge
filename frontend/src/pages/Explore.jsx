import { useState, useEffect } from 'react'

import Navbar from '../components/Navbar.jsx'
import FilterSidebar from '../components/FilterSidebar.jsx'
import IssueCard from '../components/IssueCard.jsx'
import useAuth from '../hooks/useAuth.js'
import useIssues from '../hooks/useIssues.js'

function LoadingSkeleton() {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <div 
          key={i} 
          className="bg-[#161b22] border border-[#30363d] rounded-lg p-5 flex flex-col gap-4 animate-pulse h-[160px]"
        >
          {/* Top row */}
          <div className="flex items-center justify-between gap-2">
            <div className="h-3 w-24 bg-[#30363d] rounded"></div>
            <div className="h-4 w-16 bg-[#30363d] rounded-full"></div>
          </div>
          {/* Title */}
          <div className="h-4 w-3/4 bg-[#30363d] rounded"></div>
          <div className="h-4 w-1/2 bg-[#30363d] rounded"></div>
          {/* Bottom row */}
          <div className="flex items-center justify-between gap-3 mt-auto pt-2 border-t border-[#30363d]">
            <div className="flex items-center gap-3">
              <div className="w-[52px] h-[52px] rounded-full bg-[#30363d]"></div>
              <div className="h-6 w-16 bg-[#30363d] rounded-full"></div>
            </div>
            <div className="h-8 w-24 bg-[#30363d] rounded-md"></div>
          </div>
        </div>
      ))}
    </>
  )
}

export default function Explore() {
  const { user, signIn, signOut } = useAuth()
  
  const [sidebarFilters, setSidebarFilters] = useState({
    languages: ['JavaScript'],
    skillLevel: 'Beginner',
    minScore: 0,
    _applied: Date.now()
  })

  const { issues, loading, error, fetchMore, setFilters: setHookFilters } = useIssues({
    language: 'JavaScript',
    skillLevel: 'beginner',
    page: 1,
    minScore: 0,
    _applied: Date.now()
  })

  // Synchronize sidebar apply with hook fetching
  useEffect(() => {
    setHookFilters({
      language: sidebarFilters.languages.join(',') || 'JavaScript',
      skillLevel: sidebarFilters.skillLevel.toLowerCase() || 'beginner',
      page: 1,
      minScore: sidebarFilters.minScore,
      _applied: sidebarFilters._applied
    })
  }, [sidebarFilters._applied])

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-[#f0f6fc]">
      <Navbar user={user} signIn={signIn} signOut={signOut} />

      <div className="max-w-[1200px] mx-auto px-6 py-8">

        {/* ── Two column layout ── */}
        <div className="flex gap-6 items-start flex-col md:flex-row">

          {/* Left: FilterSidebar — sticky */}
          <aside className="w-full md:w-[250px] flex-shrink-0 md:sticky md:top-[72px]">
            <FilterSidebar filters={sidebarFilters} onFilterChange={setSidebarFilters} />
          </aside>

          {/* Right: issue grid */}
          <main className="flex-1 min-w-0 w-full">
            <div className="flex items-center justify-between mb-5">
              <h1
                className="text-sm font-bold text-[#f0f6fc] tracking-wide"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                Open Issues
                <span className="ml-2 text-[#8b949e] font-normal">
                  (Found {issues.length} issues)
                </span>
              </h1>
              <span
                className="text-xs text-[#8b949e]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Sorted by friendliness score
              </span>
            </div>

            {error && (
              <div className="bg-[#f85149]/10 border border-[#f85149]/40 rounded-lg p-4 mb-4">
                <p className="text-sm text-[#f85149]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Failed to load issues: {error}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {issues.map((issue) => (
                <IssueCard key={`${issue.repo_name}-${issue.number}-${issue.id}`} issue={issue} />
              ))}
              {loading && <LoadingSkeleton />}
            </div>

            {!loading && issues.length > 0 && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={fetchMore}
                  className="text-sm font-semibold text-[#f0f6fc] border border-[#30363d] hover:border-[#8b949e] hover:bg-[#161b22] rounded-md px-6 py-2.5 transition-all duration-200"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Load More Issues ↓
                </button>
              </div>
            )}
            
            {!loading && issues.length === 0 && !error && (
              <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-10 flex flex-col items-center justify-center text-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8b949e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-4">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
                  <line x1="9" y1="9" x2="9.01" y2="9" />
                  <line x1="15" y1="9" x2="15.01" y2="9" />
                </svg>
                <p className="text-[#f0f6fc] font-semibold" style={{ fontFamily: "'Space Mono', monospace" }}>No issues found</p>
                <p className="text-sm text-[#8b949e] mt-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>Try adjusting your filters or lowering the minimum score.</p>
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  )
}
