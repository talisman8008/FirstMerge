import { useState } from 'react'
import Navbar from '../components/Navbar.jsx'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

// ── Icons ─────────────────────────────────────────────────────────────────────

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const SpinnerIcon = () => (
  <div className="w-5 h-5 rounded-full border-2 border-[#30363d] border-t-[#238636] animate-spin" />
)

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const XIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

// ── Difficulty badge ──────────────────────────────────────────────────────────

function DifficultyBadge({ difficulty }) {
  const colors = {
    Easy: 'bg-[#238636]/15 text-[#3fb950] border-[#238636]/30',
    Medium: 'bg-[#d29922]/15 text-[#d29922] border-[#d29922]/30',
    Hard: 'bg-[#f85149]/15 text-[#f85149] border-[#f85149]/30',
  }
  const colorClass = colors[difficulty] || colors.Medium

  return (
    <span
      className={`inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full border ${colorClass}`}
      style={{ fontFamily: "'Space Mono', monospace" }}
    >
      {difficulty}
    </span>
  )
}

// ── Tab button ────────────────────────────────────────────────────────────────

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
        active
          ? 'bg-[#238636] text-white shadow-lg shadow-[#238636]/20'
          : 'bg-[#161b22] text-[#8b949e] border border-[#30363d] hover:text-[#f0f6fc] hover:border-[#8b949e]'
      }`}
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {children}
    </button>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function PRCheck({ user, signIn, signOut }) {
  const [activeTab, setActiveTab] = useState('before')
  const [issueUrl, setIssueUrl] = useState('')
  const [prUrl, setPrUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [beforeResult, setBeforeResult] = useState(null)
  const [afterResult, setAfterResult] = useState(null)

  // ── Before tab handler ──────────────────────────────────────────────────

  const handleAnalyseIssue = async () => {
    if (!issueUrl.trim()) return
    setLoading(true)
    setError(null)
    setBeforeResult(null)

    try {
      const res = await fetch(`${BACKEND_URL}/api/prcheck/before`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issueUrl }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || `Server returned ${res.status}`)
      }

      setBeforeResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ── After tab handler ───────────────────────────────────────────────────

  const handleCheckPR = async () => {
    if (!prUrl.trim()) return
    setLoading(true)
    setError(null)
    setAfterResult(null)

    try {
      const res = await fetch(`${BACKEND_URL}/api/prcheck/after`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prUrl }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || `Server returned ${res.status}`)
      }

      setAfterResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-[#f0f6fc]">
      <Navbar user={user} signIn={signIn} signOut={signOut} />

      <div className="max-w-[760px] mx-auto px-6 py-10">

        {/* ── Page heading ── */}
        <div className="text-center mb-8">
          <h1
            className="text-2xl sm:text-3xl font-bold text-[#f0f6fc] mb-2"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            PR Check
          </h1>
          <p
            className="text-sm text-[#8b949e] max-w-md mx-auto"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Get AI-powered guidance before you code, or a verdict after you open your PR.
          </p>
        </div>

        {/* ── Tabs ── */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <TabButton active={activeTab === 'before'} onClick={() => { setActiveTab('before'); setError(null) }}>
            Before Writing Code
          </TabButton>
          <TabButton active={activeTab === 'after'} onClick={() => { setActiveTab('after'); setError(null) }}>
            After Opening PR
          </TabButton>
        </div>

        {/* ── Before Writing Code tab ── */}
        {activeTab === 'before' && (
          <div className="space-y-6">
            {/* Input */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6">
              <label
                className="block text-xs font-semibold text-[#8b949e] mb-3 tracking-wider uppercase"
                style={{ fontFamily: "'Space Mono', monospace" }}
                htmlFor="issue-url-input"
              >
                GitHub Issue URL
              </label>
              <div className="flex gap-3">
                <input
                  id="issue-url-input"
                  type="text"
                  value={issueUrl}
                  onChange={(e) => setIssueUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAnalyseIssue()}
                  placeholder="https://github.com/owner/repo/issues/123"
                  className="flex-1 bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-3 text-sm text-[#f0f6fc] placeholder-[#484f58] focus:outline-none focus:border-[#238636] focus:ring-1 focus:ring-[#238636]/40 transition-all duration-200"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                  disabled={loading}
                />
                <button
                  id="analyse-issue-btn"
                  onClick={handleAnalyseIssue}
                  disabled={loading || !issueUrl.trim()}
                  className="inline-flex items-center gap-2 bg-[#238636] hover:bg-[#2ea043] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg px-5 py-3 text-sm transition-all duration-200 flex-shrink-0"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {loading ? <SpinnerIcon /> : <SearchIcon />}
                  Analyse Issue
                </button>
              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div className="flex items-center justify-center gap-3 py-12 text-[#8b949e]">
                <SpinnerIcon />
                <span className="text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Fetching issue data...
                </span>
              </div>
            )}

            {/* Result */}
            {beforeResult && !loading && (
              <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden animate-[fadeIn_0.3s_ease-out]">
                {/* Header */}
                <div className="px-6 py-4 border-b border-[#30363d] flex items-center justify-between">
                  <h2
                    className="text-sm font-bold text-[#f0f6fc] tracking-wide"
                    style={{ fontFamily: "'Space Mono', monospace" }}
                  >
                    Issue Analysis
                  </h2>
                  <DifficultyBadge difficulty={beforeResult.difficulty} />
                </div>

                {/* Body */}
                <div className="p-6 space-y-5">
                  {/* What to build */}
                  <div>
                    <h3
                      className="text-xs font-semibold text-[#238636] tracking-wider uppercase mb-2"
                      style={{ fontFamily: "'Space Mono', monospace" }}
                    >
                      What to Build
                    </h3>
                    <p className="text-sm text-[#c9d1d9] leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {beforeResult.whatToBuild}
                    </p>
                  </div>

                  {/* Files to touch */}
                  <div>
                    <h3
                      className="text-xs font-semibold text-[#238636] tracking-wider uppercase mb-2"
                      style={{ fontFamily: "'Space Mono', monospace" }}
                    >
                      Files to Touch
                    </h3>
                    <p className="text-sm text-[#c9d1d9] leading-relaxed bg-[#0d1117] rounded-lg px-4 py-3 border border-[#21262d] font-mono" style={{ fontFamily: "'Space Mono', monospace" }}>
                      {beforeResult.filesToTouch}
                    </p>
                  </div>

                  {/* What to avoid */}
                  <div>
                    <h3
                      className="text-xs font-semibold text-[#d29922] tracking-wider uppercase mb-2"
                      style={{ fontFamily: "'Space Mono', monospace" }}
                    >
                      What to Avoid
                    </h3>
                    <p className="text-sm text-[#c9d1d9] leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {beforeResult.whatToAvoid}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── After Opening PR tab ── */}
        {activeTab === 'after' && (
          <div className="space-y-6">
            {/* Input */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6">
              <label
                className="block text-xs font-semibold text-[#8b949e] mb-3 tracking-wider uppercase"
                style={{ fontFamily: "'Space Mono', monospace" }}
                htmlFor="pr-url-input"
              >
                GitHub PR URL
              </label>
              <div className="flex gap-3">
                <input
                  id="pr-url-input"
                  type="text"
                  value={prUrl}
                  onChange={(e) => setPrUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCheckPR()}
                  placeholder="https://github.com/owner/repo/pull/123"
                  className="flex-1 bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-3 text-sm text-[#f0f6fc] placeholder-[#484f58] focus:outline-none focus:border-[#238636] focus:ring-1 focus:ring-[#238636]/40 transition-all duration-200"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                  disabled={loading}
                />
                <button
                  id="check-pr-btn"
                  onClick={handleCheckPR}
                  disabled={loading || !prUrl.trim()}
                  className="inline-flex items-center gap-2 bg-[#238636] hover:bg-[#2ea043] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg px-5 py-3 text-sm transition-all duration-200 flex-shrink-0"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {loading ? <SpinnerIcon /> : <SearchIcon />}
                  Check My PR
                </button>
              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div className="flex items-center justify-center gap-3 py-12 text-[#8b949e]">
                <SpinnerIcon />
                <span className="text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Analysing your contribution...
                </span>
              </div>
            )}

            {/* Result */}
            {afterResult && !loading && (
              <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden animate-[fadeIn_0.3s_ease-out]">
                {/* Verdict banner */}
                <div
                  className={`px-6 py-6 text-center border-b border-[#30363d] ${
                    afterResult.verdict === 'GENUINE'
                      ? 'bg-[#238636]/10'
                      : 'bg-[#f85149]/10'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {afterResult.verdict === 'GENUINE' ? (
                      <span className="text-[#3fb950]"><CheckIcon /></span>
                    ) : (
                      <span className="text-[#f85149]"><XIcon /></span>
                    )}
                    <span
                      className={`text-2xl sm:text-3xl font-bold tracking-wider ${
                        afterResult.verdict === 'GENUINE' ? 'text-[#3fb950]' : 'text-[#f85149]'
                      }`}
                      style={{ fontFamily: "'Space Mono', monospace" }}
                    >
                      {afterResult.verdict}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 space-y-5">
                  <div>
                    <h3
                      className="text-xs font-semibold text-[#8b949e] tracking-wider uppercase mb-2"
                      style={{ fontFamily: "'Space Mono', monospace" }}
                    >
                      Reason
                    </h3>
                    <p className="text-sm text-[#c9d1d9] leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {afterResult.reason}
                    </p>
                  </div>

                  <div>
                    <h3
                      className="text-xs font-semibold text-[#238636] tracking-wider uppercase mb-2"
                      style={{ fontFamily: "'Space Mono', monospace" }}
                    >
                      Suggestion
                    </h3>
                    <p className="text-sm text-[#c9d1d9] leading-relaxed bg-[#0d1117] rounded-lg px-4 py-3 border border-[#21262d]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {afterResult.suggestion}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Error message ── */}
        {error && (
          <div className="mt-6 bg-[#f85149]/10 border border-[#f85149]/40 rounded-lg p-4">
            <p className="text-sm text-[#f85149]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {error}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
