interface TagBadgeProps {
  tag: string
  active?: boolean
  onClick?: () => void
}

const tagColors: Record<string, string> = {
  'question-answering': 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20',
  'generative-qa': 'bg-sky-500/10 text-sky-400 border-sky-500/20 hover:bg-sky-500/20',
  'summarization': 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20',
  'conversational': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20',
  'agent': 'bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20',
  'zero-shot-react': 'bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20',
  'chat': 'bg-teal-500/10 text-teal-400 border-teal-500/20 hover:bg-teal-500/20',
  'rag': 'bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/20',
  'extraction': 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20',
  'classification': 'bg-violet-500/10 text-violet-400 border-violet-500/20 hover:bg-violet-500/20',
  'translation': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/20',
}

const activeColors: Record<string, string> = {
  'question-answering': 'bg-blue-500/25 text-blue-300 border-blue-400/40',
  'generative-qa': 'bg-sky-500/25 text-sky-300 border-sky-400/40',
  'summarization': 'bg-amber-500/25 text-amber-300 border-amber-400/40',
  'conversational': 'bg-emerald-500/25 text-emerald-300 border-emerald-400/40',
  'agent': 'bg-purple-500/25 text-purple-300 border-purple-400/40',
  'zero-shot-react': 'bg-purple-500/25 text-purple-300 border-purple-400/40',
  'chat': 'bg-teal-500/25 text-teal-300 border-teal-400/40',
  'rag': 'bg-orange-500/25 text-orange-300 border-orange-400/40',
  'extraction': 'bg-rose-500/25 text-rose-300 border-rose-400/40',
  'classification': 'bg-violet-500/25 text-violet-300 border-violet-400/40',
  'translation': 'bg-cyan-500/25 text-cyan-300 border-cyan-400/40',
}

const defaultColor = 'bg-slate-500/10 text-slate-400 border-slate-500/20 hover:bg-slate-500/20'
const defaultActiveColor = 'bg-slate-500/25 text-slate-300 border-slate-400/40'

export default function TagBadge({ tag, active, onClick }: TagBadgeProps) {
  const baseColor = active
    ? (activeColors[tag] ?? defaultActiveColor)
    : (tagColors[tag] ?? defaultColor)

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium transition-colors duration-100 ${baseColor} ${
        onClick ? 'cursor-pointer select-none' : ''
      }`}
    >
      {tag}
    </span>
  )
}
