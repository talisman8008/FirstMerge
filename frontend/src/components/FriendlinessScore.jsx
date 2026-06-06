import { useState } from 'react'

function getScoreColor(score) {
  if (score >= 70) return '#238636'
  if (score >= 40) return '#d29922'
  return '#f85149'
}

export default function FriendlinessScore({ score, breakdown, small = false }) {
  const [showTooltip, setShowTooltip] = useState(false)

  const size = small ? 52 : 80
  const strokeWidth = small ? 5 : 7
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = Math.max(0, Math.min(100, score ?? 0))
  const offset = circumference - (progress / 100) * circumference
  const color = getScoreColor(progress)

  return (
    <div
      className="relative inline-flex flex-col items-center gap-1 cursor-default"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Ring */}
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }} aria-label={`Friendliness score: ${progress}`}>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#30363d"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s ease, stroke 0.3s ease' }}
        />
      </svg>

      {/* Score number centered in ring */}
      <span
        className="absolute"
        style={{
          top: small ? 14 : 22,
          fontSize: small ? 13 : 20,
          fontWeight: 700,
          color,
          fontFamily: "'Space Mono', monospace",
          lineHeight: 1,
        }}
      >
        {progress}
      </span>

      {/* Label */}
      {!small && (
        <span
          className="text-xs text-[#8b949e] text-center"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Friendliness
        </span>
      )}

      {/* Tooltip */}
      {showTooltip && breakdown && (
        <div
          className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-2.5 shadow-lg min-w-[180px] text-left"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          <p className="text-[10px] font-semibold text-[#8b949e] uppercase tracking-wider mb-2">Breakdown</p>
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center gap-4">
              <span className="text-xs text-[#8b949e]">Avg response time</span>
              <span className="text-xs font-semibold text-[#f0f6fc]">
                {breakdown.response_time_hrs != null ? `${breakdown.response_time_hrs}h` : '—'}
              </span>
            </div>
            <div className="flex justify-between items-center gap-4">
              <span className="text-xs text-[#8b949e]">Beginner merge rate</span>
              <span className="text-xs font-semibold text-[#f0f6fc]">
                {breakdown.beginner_merge_rate != null ? `${Math.round(breakdown.beginner_merge_rate * 100)}%` : '—'}
              </span>
            </div>
          </div>
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-[#161b22] border-r border-b border-[#30363d] rotate-45 -mt-1" />
        </div>
      )}
    </div>
  )
}
