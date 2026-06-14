const LEVEL_CONFIG = {
  beginner: {
    label: 'Beginner',
    bg: 'bg-[#1f6feb]/15',
    border: 'border-[#1f6feb]/40',
    text: 'text-[#58a6ff]',
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  intermediate: {
    label: 'Intermediate',
    bg: 'bg-[#d29922]/15',
    border: 'border-[#d29922]/40',
    text: 'text-[#d29922]',
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  advanced: {
    label: 'Advanced',
    bg: 'bg-[#238636]/15',
    border: 'border-[#238636]/40',
    text: 'text-[#238636]',
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
  },
}

export default function SkillBadge({ level }) {
  const key = (level ?? '').toLowerCase()
  const config = LEVEL_CONFIG[key] ?? {
    label: level ?? 'Unknown',
    bg: 'bg-[#8b949e]/15',
    border: 'border-[#8b949e]/30',
    text: 'text-[#8b949e]',
    icon: null,
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${config.bg} ${config.border} ${config.text}`}
      style={{ fontFamily: "'Space Mono', monospace" }}
    >
      {config.icon}
      {config.label}
    </span>
  )
}
