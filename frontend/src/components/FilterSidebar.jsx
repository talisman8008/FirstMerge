import { useState } from 'react';

const LANGUAGES = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'HTML', 'CSS', 'Bootstrap', 'C++', 'Go', 'Rust', 'Kotlin', 'Swift', 'Dart', 'Ruby', 'PHP', 'C#', 'Scala', 'R', 'Julia', 'Elixir', 'Clojure', 'Haskell', 'Erlang', 'Vue', 'React', 'Node.js', 'Angular', 'Svelte', 'Next.js', 'Nuxt.js', 'Django', 'Flask', 'Spring'
]
const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced']
const LABELS = [
  { id: 'good-first-issue', name: 'Good First Issue' },
  { id: 'help-wanted', name: 'Help Wanted' },
  { id: 'beginner-friendly', name: 'Beginner Friendly' },
  { id: 'hacktoberfest', name: 'Hacktoberfest' },
  { id: 'documentation', name: 'Documentation' },
  { id: 'bug', name: 'Bug Fix' }
]

export default function FilterSidebar({ filters, onFilterChange }) {
  const [showAllLanguages, setShowAllLanguages] = useState(false);

  const {
    languages = [],
    skillLevel = '',
    minScore = 0,
    searchQuery = '',
    labels = ['good-first-issue']
  } = filters ?? {}

  const isSearchActive = searchQuery.trim().length > 0;

  const toggleLanguage = (lang) => {
    const updated = languages.includes(lang)
      ? languages.filter((l) => l !== lang)
      : [...languages, lang]
    onFilterChange({ ...filters, languages: updated })
  }

  const toggleLabel = (lblId) => {
    if (lblId === 'good-first-issue') return; // locked
    const updated = labels.includes(lblId)
      ? labels.filter((l) => l !== lblId)
      : [...labels, lblId]
    onFilterChange({ ...filters, labels: updated })
  }

  const handleSkillLevel = (level) => {
    onFilterChange({ ...filters, skillLevel: level })
  }

  const handleScore = (e) => {
    onFilterChange({ ...filters, minScore: Number(e.target.value) })
  }

  const handleSearch = (e) => {
    onFilterChange({ ...filters, searchQuery: e.target.value })
  }

  const handleApply = () => {
    // Handled by debounce in Explore.jsx now
  }

  const handleReset = () => {
    onFilterChange({ languages: [], skillLevel: '', minScore: 0, searchQuery: '', labels: ['good-first-issue'] })
  }

  return (
    <aside className="bg-[var(--bg-card)] border-r border-[var(--border)] p-5 flex flex-col gap-[20px] w-full h-full min-h-screen">
      
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search issues..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full pl-9 pr-3 py-2 min-h-[36px] bg-[var(--bg-primary)] border border-[var(--border)] rounded-md text-[13px] font-sans text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--border-hover)]"
        />
      </div>

      {/* Language filter */}
      <div className="flex flex-col gap-2">
        <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--text-muted)] mb-[8px]">
          Language
        </p>
        <div className="flex flex-wrap gap-2">
          {(showAllLanguages ? LANGUAGES : Array.from(new Set([...LANGUAGES.slice(0, 14), ...(languages || [])]))).map(lang => (
            <button
              key={lang}
              onClick={() => toggleLanguage(lang)}
              className={`
                font-sans text-[12px] font-normal px-[12px] py-[5px] rounded-[4px] transition-all duration-150
                ${(languages || []).includes(lang) 
                  ? 'bg-[var(--bg-selected)] text-[var(--text-primary)] border border-[var(--border-selected)]' 
                  : 'bg-transparent text-[var(--text-muted)] border border-[var(--border)] hover:border-[var(--border-hover)] hover:text-[var(--text-primary)]'}
              `}>
              {lang}
            </button>
          ))}
          <button
            onClick={() => setShowAllLanguages(!showAllLanguages)}
            className="mt-1 font-sans text-[12px] font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors duration-150 px-[4px] py-[5px]"
          >
            {showAllLanguages ? 'Read less' : 'Read more'}
          </button>
        </div>
      </div>

      {/* Labels filter */}
      <div id="tour-sidebar-labels" className="flex flex-col gap-2">
        <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--text-muted)] mb-[8px]">
          Labels
        </p>
        <div className="flex flex-wrap gap-2">
          {LABELS.map(lbl => {
            const isSelected = labels.includes(lbl.id);
            const isLocked = lbl.id === 'good-first-issue' || isSearchActive;
            return (
              <button
                key={lbl.id}
                onClick={() => toggleLabel(lbl.id)}
                disabled={isLocked}
                className={`
                  font-sans text-[12px] font-normal px-[12px] py-[5px] rounded-[4px] transition-all duration-150 flex items-center gap-1.5
                  ${isSelected && !isSearchActive
                    ? 'bg-[var(--bg-selected)] text-[var(--text-primary)] border border-[var(--border-selected)]'
                    : 'bg-transparent text-[var(--text-muted)] border border-[var(--border)] hover:border-[var(--border-hover)] hover:text-[var(--text-primary)]'}
                  ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}
                `}>
                {isLocked && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                )}
                {lbl.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Skill level */}
      <div id="tour-skill-level" className="flex flex-col gap-2">
        <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--text-muted)] mb-[8px]">
          Skill Level
        </p>
        <div className="flex flex-col gap-2">
          {SKILL_LEVELS.map((level) => (
            <button
              key={level}
              onClick={() => handleSkillLevel(level)}
              disabled={isSearchActive}
              className={`
                w-full text-left font-sans text-[13px] font-normal px-[12px] py-[8px] rounded-[4px] transition-all duration-150
                ${skillLevel === level && !isSearchActive
                  ? 'bg-[var(--bg-selected)] text-[var(--text-primary)] border border-[var(--border-selected)]' 
                  : 'bg-transparent text-[var(--text-muted)] border border-[var(--border)] hover:border-[var(--border-hover)] hover:text-[var(--text-primary)]'}
                ${isSearchActive ? 'opacity-50 cursor-not-allowed' : ''}
              `}>
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Min friendliness score */}
      <div id="tour-min-score" className="flex flex-col gap-3">
        <div className="flex items-center justify-between mb-[8px]">
          <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--text-muted)]">
            Min Score
          </span>
          <span className="font-mono text-[13px] font-semibold text-[var(--text-primary)]">
            {minScore}
          </span>
        </div>
        <input
          id="filter-min-score"
          type="range"
          min={0}
          max={100}
          step={5}
          value={minScore}
          onChange={handleScore}
          className="w-full h-1 bg-[var(--border)] rounded-full appearance-none cursor-pointer mt-1"
          style={{ accentColor: 'var(--accent-green)' }}
        />
        <div className="flex justify-between font-mono text-[12px] text-[var(--text-muted)]">
          <span>0</span>
          <span>50</span>
          <span>100</span>
        </div>
      </div>

      <div className="mt-auto pt-6 flex flex-col gap-2">
        <button
          onClick={handleReset}
          className="w-full font-sans text-[12px] text-[var(--text-muted)] hover:text-[var(--text-primary)] py-2 transition-colors duration-150 rounded-md focus:outline-none"
        >
          Reset Filters
        </button>
        <button
          onClick={handleApply}
          className="w-full font-sans text-[14px] font-semibold text-black bg-[var(--accent-green)] hover:bg-[#2ea043] py-2.5 rounded-[6px] transition-colors duration-150 focus:outline-none"
        >
          Apply
        </button>
      </div>

    </aside>
  )
}
