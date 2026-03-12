import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import type { Prompt } from '../types'

interface ModalLabels {
  title: string
  namePlaceholder: string
  textPlaceholder: string
  submitBtn: string
}

interface CreateItemModalProps {
  onClose: () => void
  onCreated: (item: Prompt) => void
  createFn: (item: Prompt) => Promise<Prompt>
  labels: ModalLabels
}

export default function CreateItemModal({ onClose, onCreated, createFn, labels }: CreateItemModalProps) {
  const [name, setName] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [description, setDescription] = useState('')
  const [text, setText] = useState('')
  const [version, setVersion] = useState('')
  const [tags, setTags] = useState('')
  const [card, setCard] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const item = await createFn({
        name: name.trim(),
        author_name: authorName.trim(),
        description: description.trim(),
        text: text.trim(),
        version: version.trim(),
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        ...(card.trim() ? { card: card.trim() } : {}),
      })
      onCreated(item)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setSubmitting(false)
    }
  }

  const inputCls =
    'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 outline-none transition-colors focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-slate-200 dark:placeholder-slate-600 dark:focus:border-indigo-500/50 dark:focus:ring-indigo-500/30'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-white/[0.08] dark:bg-[#0d1117]">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-white/[0.06]">
          <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">{labels.title}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:text-slate-600 dark:hover:text-slate-400"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                Name <span className="text-red-400">*</span>
              </label>
              <input
                className={inputCls}
                placeholder={labels.namePlaceholder}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="col-span-2">
              <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                Author <span className="text-red-400">*</span>
              </label>
              <input
                className={inputCls}
                placeholder="rnditb2c"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                Version <span className="text-red-400">*</span>
              </label>
              <input
                className={inputCls}
                placeholder="1.0.0"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">Tags</label>
              <input
                className={inputCls}
                placeholder="tag1, tag2, ..."
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>
            <div className="col-span-2">
              <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                Description <span className="text-red-400">*</span>
              </label>
              <input
                className={inputCls}
                placeholder="Short description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="col-span-2">
              <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                Text <span className="text-red-400">*</span>
              </label>
              <textarea
                className={`${inputCls} h-32 resize-y`}
                placeholder={labels.textPlaceholder}
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
              />
            </div>
            <div className="col-span-2">
              <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                Card <span className="text-slate-400 dark:text-slate-600">(optional, markdown)</span>
              </label>
              <textarea
                className={`${inputCls} h-28 resize-y font-mono text-xs`}
                placeholder="# My Item&#10;Extended markdown description…"
                value={card}
                onChange={(e) => setCard(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60"
            >
              {submitting && <Loader2 size={14} className="animate-spin" />}
              {labels.submitBtn}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
