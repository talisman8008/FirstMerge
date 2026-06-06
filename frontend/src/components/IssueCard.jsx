import { useNavigate } from 'react-router-dom'
import FriendlinessScore from './FriendlinessScore.jsx'
import LivenessCheck from './LivenessCheck.jsx'

// Language → pill color mapping
const LANG_COLORS = {
  JavaScript:  { bg: 'bg-[#f7df1e]/15', text: 'text-[#f7df1e]',  border: 'border-[#f7df1e]/30' },
  TypeScript:  { bg: 'bg-[#3178c6]/15', text: 'text-[#3178c6]',  border: 'border-[#3178c6]/30' },
  Python:      { bg: 'bg-[#3572A5]/15', text: 'text-[#5a9fd4]',  border: 'border-[#3572A5]/30' },
  Java:        { bg: 'bg-[#b07219]/15', text: 'text-[#e09850]',  border: 'border-[#b07219]/30' },
  'C++':       { bg: 'bg-[#f34b7d]/15', text: 'text-[#f34b7d]',  border: 'border-[#f34b7d]/30' },
  Go:          { bg: 'bg-[#00ADD8]/15', text: 'text-[#00ADD8]',  border: 'border-[#00ADD8]/30' },
  Rust:        { bg: 'bg-[#dea584]/15', text: 'text-[#dea584]',  border: 'border-[#dea584]/30' },
  Ruby:        { bg: 'bg-[#701516]/15', text: 'text-[#e05252]',  border: 'border-[#701516]/30' },
  PHP:         { bg: 'bg-[#4F5D95]/15', text: 'text-[#7a89c4]',  border: 'border-[#4F5D95]/30' },
  Swift:       { bg: 'bg-[#F05138]/15', text: 'text-[#F05138]',  border: 'border-[#F05138]/30' },
}

const DEFAULT_LANG = { bg: 'bg-[#8b949e]/15', text: 'text-[#8b949e]', border: 'border-[#8b949e]/30' }

function LanguageBadge({ language }) {
  const colors = LANG_COLORS[language] ?? DEFAULT_LANG
  return (
    <span
      className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full border ${colors.bg} ${colors.text} ${colors.border}`}
      style={{ fontFamily: "'Space Mono', monospace" }}
    >
      {language ?? 'Unknown'}
    </span>
  )
}

export default function IssueCard({ issue }) {
  const navigate = useNavigate()
  const {
    title,
    repo_name,
    language,
    url,
    friendliness_score,
    open_pr_count,
    score_breakdown,
  } = issue ?? {}

  const handleView = () => {
    if (url) window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <article className="bg-[#161b22] border border-[#30363d] rounded-lg p-5 flex flex-col gap-4 hover:border-[#238636] transition-all duration-200 group">

      {/* Top row: repo name + language badge */}
      <div className="flex items-center justify-between gap-2">
        <span
          className="text-xs text-[#8b949e] truncate"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
          title={repo_name}
        >
          {repo_name ?? 'unknown/repo'}
        </span>
        <LanguageBadge language={language} />
      </div>

      {/* Issue title */}
      <h3
        className="text-sm font-semibold text-[#f0f6fc] leading-snug line-clamp-2 group-hover:text-white transition-colors duration-200"
        style={{ fontFamily: "'Space Mono', monospace" }}
      >
        {title ?? 'Untitled Issue'}
      </h3>

      {/* Bottom row: score + liveness + CTA */}
      <div className="flex items-center justify-between gap-3 mt-auto pt-2 border-t border-[#30363d]">
        <div className="flex items-center gap-3">
          <FriendlinessScore
            score={friendliness_score ?? 0}
            breakdown={score_breakdown}
            small
          />
          <LivenessCheck openPRCount={open_pr_count ?? 0} />
        </div>

        <button
          id={`issue-view-${encodeURIComponent(title ?? 'issue')}`}
          onClick={handleView}
          className="text-xs font-semibold text-[#238636] border border-[#238636]/40 hover:bg-[#238636]/10 rounded-md px-3 py-1.5 transition-all duration-200 flex-shrink-0"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          View Issue →
        </button>
      </div>
    </article>
  )
}
