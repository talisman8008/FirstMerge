function getBadgeConfig(count) {
  if (count === 0) return { label: 'Fresh',   bg: 'bg-[#238636]/15',  border: 'border-[#238636]/40', text: 'text-[#238636]',  icon: '✦' }
  if (count <= 2)  return { label: 'Active',  bg: 'bg-[#d29922]/15',  border: 'border-[#d29922]/40', text: 'text-[#d29922]',  icon: '⚡' }
  if (count <= 5)  return { label: 'Crowded', bg: 'bg-[#e3702a]/15',  border: 'border-[#e3702a]/40', text: 'text-[#e3702a]',  icon: '⚠' }
  return           { label: 'Avoid',  bg: 'bg-[#f85149]/15',  border: 'border-[#f85149]/40', text: 'text-[#f85149]',  icon: '✕' }
}

export default function LivenessCheck({ openPRCount }) {
  const count = openPRCount ?? 0
  const { label, bg, border, text, icon } = getBadgeConfig(count)

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${bg} ${border} ${text}`}
      style={{ fontFamily: "'Space Mono', monospace" }}
      title={`${count} open PR${count !== 1 ? 's' : ''} targeting this issue`}
    >
      <span aria-hidden="true">{icon}</span>
      {label}
      <span className="opacity-70">({count})</span>
    </span>
  )
}
