const LANGUAGES = ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'Go', 'Rust', 'Ruby']
const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced']

export default function FilterSidebar({ filters, onFilterChange }) {
  const {
    languages = [],
    skillLevel = '',
    minScore = 0,
  } = filters ?? {}

  const toggleLanguage = (lang) => {
    const updated = languages.includes(lang)
      ? languages.filter((l) => l !== lang)
      : [...languages, lang]
    onFilterChange({ ...filters, languages: updated })
  }

  const handleSkillLevel = (level) => {
    onFilterChange({ ...filters, skillLevel: level })
  }

  const handleScore = (e) => {
    onFilterChange({ ...filters, minScore: Number(e.target.value) })
  }

  const handleApply = () => {
    onFilterChange({ ...filters, _applied: Date.now() })
  }

  const handleReset = () => {
    onFilterChange({ languages: [], skillLevel: '', minScore: 0 })
  }

  return (
    <aside className="bg-[#161b22] border border-[#30363d] rounded-lg p-5 flex flex-col gap-6 w-full">

      {/* Header */}
      <h2
        className="text-xs font-bold text-[#f0f6fc] tracking-widest uppercase"
        style={{ fontFamily: "'Space Mono', monospace" }}
      >
        Filters
      </h2>

      {/* Language filter */}
      <div className="flex flex-col gap-3">
        <p
          className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider"
          style={{ fontFamily: "'Space Mono', monospace" }}
        >
          Language
        </p>
        <div className="flex flex-col gap-2">
          {LANGUAGES.map((lang) => (
            <label
              key={lang}
              className="flex items-center gap-2.5 cursor-pointer group"
              htmlFor={`lang-${lang}`}
            >
              <input
                id={`lang-${lang}`}
                type="checkbox"
                checked={languages.includes(lang)}
                onChange={() => toggleLanguage(lang)}
                className="w-3.5 h-3.5 rounded border-[#30363d] bg-[#0d1117] accent-[#238636] cursor-pointer"
              />
              <span
                className="text-sm text-[#8b949e] group-hover:text-[#f0f6fc] transition-colors duration-150"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {lang}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="h-px bg-[#30363d]" />

      {/* Skill level */}
      <div className="flex flex-col gap-3">
        <p
          className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider"
          style={{ fontFamily: "'Space Mono', monospace" }}
        >
          Skill Level
        </p>
        <div className="flex flex-col gap-2">
          {SKILL_LEVELS.map((level) => (
            <label
              key={level}
              className="flex items-center gap-2.5 cursor-pointer group"
              htmlFor={`skill-${level}`}
            >
              <input
                id={`skill-${level}`}
                type="radio"
                name="skillLevel"
                value={level}
                checked={skillLevel === level}
                onChange={() => handleSkillLevel(level)}
                className="w-3.5 h-3.5 border-[#30363d] bg-[#0d1117] accent-[#238636] cursor-pointer"
              />
              <span
                className="text-sm text-[#8b949e] group-hover:text-[#f0f6fc] transition-colors duration-150"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {level}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="h-px bg-[#30363d]" />

      {/* Min friendliness score */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p
            className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            Min Score
          </p>
          <span
            className="text-xs font-bold text-[#238636]"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
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
          className="w-full h-1 bg-[#30363d] rounded-full appearance-none cursor-pointer accent-[#238636]"
        />
        <div className="flex justify-between text-[10px] text-[#8b949e]" style={{ fontFamily: "'Space Mono', monospace" }}>
          <span>0</span>
          <span>50</span>
          <span>100</span>
        </div>
      </div>

      <div className="h-px bg-[#30363d]" />

      {/* Actions */}
      <div className="flex flex-col gap-2">
        <button
          id="filter-apply-btn"
          onClick={handleApply}
          className="w-full bg-[#238636] hover:bg-[#2ea043] text-white text-sm font-semibold rounded-md py-2 transition-all duration-200"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Apply Filters
        </button>
        <button
          id="filter-reset-btn"
          onClick={handleReset}
          className="w-full text-sm text-[#8b949e] hover:text-[#f0f6fc] py-1.5 transition-colors duration-200"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Reset
        </button>
      </div>

    </aside>
  )
}
