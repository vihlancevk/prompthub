import { useState } from 'react'
import { Copy, Check, ChevronRight } from 'lucide-react'
import type { Prompt } from '../types'
import TagBadge from './TagBadge'

interface ItemCardProps {
  item: Prompt
  selected: boolean
  onClick: () => void
}

const MAX_TAGS = 2

export default function ItemCard({ item, selected, onClick }: ItemCardProps) {
  const [copied, setCopied] = useState(false)
  const tags = item.tags ?? []
  const visibleTags = tags.slice(0, MAX_TAGS)
  const extraTags = tags.length - MAX_TAGS

  async function handleCopy(e: React.MouseEvent) {
    e.stopPropagation()
    await navigator.clipboard.writeText(item.text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={onClick}
      className={`group relative w-full rounded-xl border p-4 text-left transition-all duration-150 ${
        selected
          ? 'border-indigo-400/50 bg-indigo-50 shadow-lg shadow-indigo-500/10 dark:border-indigo-500/40 dark:bg-indigo-500/[0.07]'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-white/[0.06] dark:bg-white/[0.02] dark:hover:border-white/[0.1] dark:hover:bg-white/[0.04]'
      }`}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <span className="block text-xs text-slate-400 dark:text-slate-500">{item.author_name}/</span>
          <span className="block truncate text-sm font-semibold text-slate-900 dark:text-white">
            {item.name}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={handleCopy}
            className="rounded-md p-1.5 text-slate-400 opacity-0 transition-all duration-100 hover:bg-slate-100 hover:text-slate-700 group-hover:opacity-100 dark:text-slate-500 dark:hover:bg-white/[0.06] dark:hover:text-white"
            title="Copy text"
          >
            {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
          </button>
          <ChevronRight
            size={14}
            className={`transition-colors duration-100 ${
              selected
                ? 'text-indigo-500 dark:text-indigo-400'
                : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-600 dark:group-hover:text-slate-400'
            }`}
          />
        </div>
      </div>

      <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
        {item.description}
      </p>

      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {visibleTags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
          {extraTags > 0 && (
            <span className="text-xs text-slate-400 dark:text-slate-600">+{extraTags}</span>
          )}
        </div>
        {item.version && (
          <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-500 dark:bg-white/[0.04] dark:text-slate-600">
            {item.version}
          </span>
        )}
      </div>
    </button>
  )
}
