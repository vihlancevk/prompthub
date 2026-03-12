interface TagBadgeProps {
  tag: string
  active?: boolean
  onClick?: () => void
}

const tagColorMap: Record<string, { base: string; active: string }> = {
  'best-practices': {
    base: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20',
    active: 'bg-emerald-500/25 text-emerald-300 border-emerald-400/40',
  },
  'chat': {
    base: 'bg-teal-500/10 text-teal-400 border-teal-500/20 hover:bg-teal-500/20',
    active: 'bg-teal-500/25 text-teal-300 border-teal-400/40',
  },
  'classification': {
    base: 'bg-violet-500/10 text-violet-400 border-violet-500/20 hover:bg-violet-500/20',
    active: 'bg-violet-500/25 text-violet-300 border-violet-400/40',
  },
  'code-review': {
    base: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20',
    active: 'bg-emerald-500/25 text-emerald-300 border-emerald-400/40',
  },
  'coding': {
    base: 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20',
    active: 'bg-blue-500/25 text-blue-300 border-blue-400/40',
  },
  'conversational': {
    base: 'bg-teal-500/10 text-teal-400 border-teal-500/20 hover:bg-teal-500/20',
    active: 'bg-teal-500/25 text-teal-300 border-teal-400/40',
  },
  'database': {
    base: 'bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/20',
    active: 'bg-orange-500/25 text-orange-300 border-orange-400/40',
  },
  'debugging': {
    base: 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20',
    active: 'bg-rose-500/25 text-rose-300 border-rose-400/40',
  },
  'docs': {
    base: 'bg-sky-500/10 text-sky-400 border-sky-500/20 hover:bg-sky-500/20',
    active: 'bg-sky-500/25 text-sky-300 border-sky-400/40',
  },
  'extraction': {
    base: 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20',
    active: 'bg-rose-500/25 text-rose-300 border-rose-400/40',
  },
  'generative-qa': {
    base: 'bg-sky-500/10 text-sky-400 border-sky-500/20 hover:bg-sky-500/20',
    active: 'bg-sky-500/25 text-sky-300 border-sky-400/40',
  },
  'git': {
    base: 'bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/20',
    active: 'bg-orange-500/25 text-orange-300 border-orange-400/40',
  },
  'productivity': {
    base: 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20',
    active: 'bg-amber-500/25 text-amber-300 border-amber-400/40',
  },
  'question-answering': {
    base: 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20',
    active: 'bg-blue-500/25 text-blue-300 border-blue-400/40',
  },
  'rag': {
    base: 'bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/20',
    active: 'bg-orange-500/25 text-orange-300 border-orange-400/40',
  },
  'sql': {
    base: 'bg-violet-500/10 text-violet-400 border-violet-500/20 hover:bg-violet-500/20',
    active: 'bg-violet-500/25 text-violet-300 border-violet-400/40',
  },
  'summarization': {
    base: 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20',
    active: 'bg-amber-500/25 text-amber-300 border-amber-400/40',
  },
  'text-processing': {
    base: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/20',
    active: 'bg-cyan-500/25 text-cyan-300 border-cyan-400/40',
  },
  'translation': {
    base: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/20',
    active: 'bg-cyan-500/25 text-cyan-300 border-cyan-400/40',
  },
  'writing': {
    base: 'bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20',
    active: 'bg-purple-500/25 text-purple-300 border-purple-400/40',
  },
  'zero-shot-react': {
    base: 'bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20',
    active: 'bg-purple-500/25 text-purple-300 border-purple-400/40',
  },
}

const defaultColors = {
  base: 'bg-slate-500/10 text-slate-400 border-slate-500/20 hover:bg-slate-500/20',
  active: 'bg-slate-500/25 text-slate-300 border-slate-400/40',
}

export default function TagBadge({ tag, active, onClick }: TagBadgeProps) {
  const colors = tagColorMap[tag] ?? defaultColors

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium transition-colors duration-100 ${active ? colors.active : colors.base} ${
        onClick ? 'cursor-pointer select-none' : ''
      }`}
    >
      {tag}
    </span>
  )
}
