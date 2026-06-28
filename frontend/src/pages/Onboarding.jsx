import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth.js'
import supabase from '../lib/supabase.js'

// ── Constants ────────────────────────────────────────────────────────────────

const LANGUAGES = [
  'JavaScript', 'TypeScript', 'Python', 'Java',
  'C++', 'Go', 'Rust', 'Ruby', 'PHP', 'Swift',
]

const EXPERIENCE_LEVELS = [
  {
    id: 'beginner',
    label: 'Beginner',
    description: "I'm just getting started, less than 1 year coding",
  },
  {
    id: 'intermediate',
    label: 'Intermediate',
    description: "I'm comfortable, 1–2 years coding",
  },
  {
    id: 'advanced',
    label: 'Advanced',
    description: "I'm confident, 2+ years coding",
  },
]

const INTERESTS = [
  'Frontend', 'Backend', 'DevOps', 'ML/AI',
  'Mobile', 'Documentation', 'Testing', 'Security',
]

const TOTAL_STEPS = 3

// ── Sub-components ────────────────────────────────────────────────────────────

function ProgressBar({ step }) {
  return (
    <div className="w-full flex flex-col gap-2 mb-10">
      <div className="flex justify-between items-center">
        <span
          className="text-xs text-[var(--text-muted)]"
          style={{ fontFamily: "'Space Mono', monospace" }}
        >
          Step {step} of {TOTAL_STEPS}
        </span>
        <span
          className="text-xs text-[var(--accent-green)]"
          style={{ fontFamily: "'Space Mono', monospace" }}
        >
          {Math.round((step / TOTAL_STEPS) * 100)}%
        </span>
      </div>
      <div className="h-1 w-full bg-[var(--border)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--accent-green)] rounded-full transition-all duration-500"
          style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
        />
      </div>
    </div>
  )
}

function MultiSelectPill({ label, selected, onToggle }) {
  return (
    <button
      id={`pill-${label.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`}
      type="button"
      onClick={() => onToggle(label)}
      className={`
        px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200
        ${selected
          ? 'bg-[var(--accent-green)]/20 border-[var(--accent-green)] text-[var(--accent-green)]'
          : 'bg-[var(--bg-card)] border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--text-muted)] hover:text-[var(--text-primary)]'
        }
      `}
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {selected && (
        <span className="mr-1.5 text-[var(--accent-green)]">✓</span>
      )}
      {label}
    </button>
  )
}

// ── Steps ─────────────────────────────────────────────────────────────────────

function StepLanguages({ selected, onToggle }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2
          className="text-2xl font-bold text-[var(--text-primary)]"
          style={{ fontFamily: "'Space Mono', monospace" }}
        >
          What languages do you know?
        </h2>
        <p
          className="mt-2 text-sm text-[var(--text-muted)]"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Select all that apply — we'll find repos that match.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        {LANGUAGES.map((lang) => (
          <MultiSelectPill
            key={lang}
            label={lang}
            selected={selected.includes(lang)}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  )
}

function StepExperience({ selected, onSelect }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2
          className="text-2xl font-bold text-[var(--text-primary)]"
          style={{ fontFamily: "'Space Mono', monospace" }}
        >
          How would you describe your experience?
        </h2>
        <p
          className="mt-2 text-sm text-[var(--text-muted)]"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Pick the one that feels right. You can always explore beyond it.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        {EXPERIENCE_LEVELS.map((level) => {
          const isSelected = selected === level.id
          return (
            <button
              id={`exp-${level.id}`}
              key={level.id}
              type="button"
              onClick={() => onSelect(level.id)}
              className={`
                w-full text-left p-4 rounded-lg border transition-all duration-200
                ${isSelected
                  ? 'border-[var(--accent-green)] bg-[var(--accent-green)]/10'
                  : 'border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--text-muted)]'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-sm font-semibold ${isSelected ? 'text-[var(--accent-green)]' : 'text-[var(--text-primary)]'}`}
                  style={{ fontFamily: "'Space Mono', monospace" }}
                >
                  {level.label}
                </span>
                {isSelected && (
                  <span className="w-4 h-4 rounded-full bg-[var(--accent-green)] flex items-center justify-center flex-shrink-0">
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="2 6 5 9 10 3" />
                    </svg>
                  </span>
                )}
              </div>
              <p
                className="mt-1 text-xs text-[var(--text-muted)]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {level.description}
              </p>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function StepInterests({ selected, onToggle }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2
          className="text-2xl font-bold text-[var(--text-primary)]"
          style={{ fontFamily: "'Space Mono', monospace" }}
        >
          What areas interest you?
        </h2>
        <p
          className="mt-2 text-sm text-[var(--text-muted)]"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          We'll surface issues from these domains first.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        {INTERESTS.map((area) => (
          <MultiSelectPill
            key={area}
            label={area}
            selected={selected.includes(area)}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function Onboarding() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [languages, setLanguages] = useState([])
  const [skillLevel, setSkillLevel] = useState('')
  const [interests, setInterests] = useState([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  // ── Toggle helpers ──

  const toggleLanguage = (lang) =>
    setLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    )

  const toggleInterest = (area) =>
    setInterests((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    )

  const handleSkillSelect = (levelId) => {
    setSkillLevel(levelId)
    setTimeout(() => {
      handleNext()
    }, 300)
  }

  // ── Validation ──

  const canAdvance = () => {
    if (step === 1) return languages.length > 0
    if (step === 2) return skillLevel !== ''
    if (step === 3) return interests.length > 0
    return false
  }

  // ── Submit ──

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

  const handleSubmit = async () => {
    if (!user) {
      setError('You must be logged in to save your profile.')
      return
    }
    setSaving(true)
    setError(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()

      const res = await fetch(`${BACKEND_URL}/api/user/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          languages,
          skill_level: skillLevel,
          interests
        })
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to save profile')
      }

      navigate('/explore')
    } catch (err) {
      setError("Uh oh! Our database hamsters tripped on their wheel. Please try saving again!")
    } finally {
      setSaving(false)
    }
  }

  // ── Navigation ──

  const handleNext = () => {
    if (step < TOTAL_STEPS) setStep((s) => s + 1)
    else handleSubmit()
  }

  const handleBack = () => {
    if (step > 1) setStep((s) => s - 1)
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col relative overflow-hidden font-body">
      
      {/* Architectural Wallpaper */}
      <div 
        className="absolute inset-0 z-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, var(--border) 0, var(--border) 1px, transparent 1px, transparent 32px)`
        }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-[var(--bg-primary)]/50 to-[var(--bg-primary)] pointer-events-none" />

      {/* Header */}
      <nav className="w-full relative z-10 bg-[var(--bg-primary)]/80 backdrop-blur-md border-b border-[var(--border)]">
        <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center gap-2">
          <img src="/logos/firstmerge-icon.svg" alt="FirstMerge" className="w-6 h-6" />
          <span className="font-sans text-[20px] font-bold text-[var(--text-primary)]">
            FirstMerge
          </span>
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-16 relative z-10">
        <div className="w-full max-w-[600px] flex flex-col">
          <ProgressBar step={step} />

          {/* Step content */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-8">
            {step === 1 && (
              <StepLanguages selected={languages} onToggle={toggleLanguage} />
            )}
            {step === 2 && (
              <StepExperience selected={skillLevel} onSelect={handleSkillSelect} />
            )}
            {step === 3 && (
              <StepInterests selected={interests} onToggle={toggleInterest} />
            )}

            {/* Error */}
            {error && (
              <p
                className="mt-4 text-xs text-[var(--accent-red)]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {error}
              </p>
            )}

            {/* Navigation buttons */}
            <div className="mt-8 flex items-center justify-between">
              <button
                id="onboarding-back-btn"
                type="button"
                onClick={handleBack}
                disabled={step === 1}
                className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border)] rounded-md px-4 py-2 transition-all duration-200 hover:bg-[var(--bg-card-hover)] disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                ← Back
              </button>

              <button
                id="onboarding-next-btn"
                type="button"
                onClick={handleNext}
                disabled={!canAdvance() || saving}
                className="inline-flex items-center gap-2 bg-[var(--accent-green)] hover:bg-[var(--accent-green)] text-white text-sm font-semibold rounded-md px-5 py-2 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {saving ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Saving…
                  </>
                ) : step === TOTAL_STEPS ? (
                  "Let's Go →"
                ) : (
                  'Next →'
                )}
              </button>
            </div>
          </div>

          {/* Step dots */}
          <div className="mt-6 flex items-center justify-center gap-2">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i + 1 === step
                    ? 'bg-[var(--accent-green)] w-4'
                    : i + 1 < step
                    ? 'bg-[var(--accent-green)]/40'
                    : 'bg-[var(--border)]'
                }`}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
