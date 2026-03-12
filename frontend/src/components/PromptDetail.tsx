import { useEffect, useState } from 'react'
import { X, Copy, Check, User } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import type { Prompt } from '../types'
import { fetchCard } from '../api'
import TagBadge from './TagBadge'

interface PromptDetailProps {
  prompt: Prompt
  onClose: () => void
}

// Highlights {variable} placeholders in indigo
function PromptText({ text }: { text: string }) {
  const parts = text.split(/(\{[^}]+\})/g)
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

export default function PromptDetail({ prompt, onClose }: PromptDetailProps) {
  const [copied, setCopied] = useState(false)
  const [card, setCard] = useState<string | null>(null)

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Escape key to close
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // Fetch markdown card
  useEffect(() => {
    setCard(null)
    fetchCard(prompt.author_name, prompt.name).then(setCard).catch(() => setCard(''))
  }, [prompt.name, prompt.author_name])

  async function handleCopy() {
    await navigator.clipboard.writeText(prompt.text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm animate-fade-in dark:bg-black/60"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 z-50 flex h-full w-full max-w-2xl flex-col border-l border-slate-200 bg-white shadow-2xl animate-slide-in dark:border-white/[0.08] dark:bg-[#0d1117]">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5 dark:border-white/[0.06]">
          <div className="min-w-0 flex-1">
            <p className="mb-0.5 text-xs text-slate-400 dark:text-slate-500">{prompt.author_name}/</p>
            <h2 className="truncate text-lg font-semibold text-slate-900 dark:text-white">
              {prompt.name}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                <User size={11} />
                {prompt.author_name}
              </span>
              {prompt.version && (
                <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-500 dark:bg-white/[0.04]">
                  {prompt.version}
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

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Tags */}
          {(prompt.tags ?? []).length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {prompt.tags!.map((tag) => (
                <TagBadge key={tag} tag={tag} />
              ))}
            </div>
          )}

          {/* Description */}
          <div>
            <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-600">
              Description
            </p>
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{prompt.description}</p>
          </div>

          {/* Prompt text */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-600">
                Prompt
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
              <PromptText text={prompt.text} />
            </pre>
          </div>

          {/* Markdown docs */}
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
