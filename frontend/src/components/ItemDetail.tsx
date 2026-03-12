import { useEffect, useState } from 'react'
import { X, Copy, Check, User } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import type { Prompt } from '../types'
import TagBadge from './TagBadge'

const PLACEHOLDER_RE = /(\{[^}]+\})/g

function HighlightedText({ text }: { text: string }) {
  const parts = text.split(PLACEHOLDER_RE)
  return (
    <>
      {parts.map((part, i) =>
        /^\{[^}]+\}$/.test(part) ? (
          <span key={i} className="rounded bg-indigo-500/15 px-0.5 text-indigo-600 dark:text-indigo-300">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  )
}

interface ItemDetailProps {
  item: Prompt
  onClose: () => void
  fetchCard: (author: string, name: string) => Promise<string>
  label: string
}

export default function ItemDetail({ item, onClose, fetchCard, label }: ItemDetailProps) {
  const [copied, setCopied] = useState(false)
  const [card, setCard] = useState<string | null>(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    setCard(null)
    fetchCard(item.author_name, item.name).then(setCard).catch(() => setCard(''))
  }, [item.name, item.author_name, fetchCard])

  async function handleCopy() {
    await navigator.clipboard.writeText(item.text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm animate-fade-in dark:bg-black/60"
        onClick={onClose}
      />

      <div className="fixed right-0 top-0 z-50 flex h-full w-full max-w-2xl flex-col border-l border-slate-200 bg-white shadow-2xl animate-slide-in dark:border-white/[0.08] dark:bg-[#0d1117]">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5 dark:border-white/[0.06]">
          <div className="min-w-0 flex-1">
            <p className="mb-0.5 text-xs text-slate-400 dark:text-slate-500">{item.author_name}/</p>
            <h2 className="truncate text-lg font-semibold text-slate-900 dark:text-white">{item.name}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                <User size={11} />
                {item.author_name}
              </span>
              {item.version && (
                <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-500 dark:bg-white/[0.04]">
                  {item.version}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-500 dark:hover:bg-white/[0.06] dark:hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {(item.tags ?? []).length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {item.tags!.map((tag) => (
                <TagBadge key={tag} tag={tag} />
              ))}
            </div>
          )}

          <div>
            <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-600">
              Description
            </p>
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{item.description}</p>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-600">
                {label}
              </p>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-slate-400 dark:hover:border-white/[0.14] dark:hover:bg-white/[0.06] dark:hover:text-white"
              >
                {copied ? (
                  <>
                    <Check size={12} className="text-emerald-500" />
                    <span className="text-emerald-500">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    Copy
                  </>
                )}
              </button>
            </div>
            <pre className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs leading-relaxed text-slate-700 whitespace-pre-wrap break-words dark:border-white/[0.06] dark:bg-white/[0.03] dark:text-slate-300">
              <HighlightedText text={item.text} />
            </pre>
          </div>

          {card !== null && card !== '' && (
            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-600">
                Documentation
              </p>
              <div className="markdown-body">
                <ReactMarkdown>{card}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
