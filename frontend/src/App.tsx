import { useEffect, useMemo, useState } from 'react'
import { Search, X, Loader2 } from 'lucide-react'
import type { Prompt } from './types'
import { fetchPrompts } from './api'
import Header from './components/Header'
import TagBadge from './components/TagBadge'
import PromptCard from './components/PromptCard'
import PromptDetail from './components/PromptDetail'

export default function App() {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [selected, setSelected] = useState<Prompt | null>(null)

  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('theme')
    return stored ? stored === 'dark' : true
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  useEffect(() => {
    fetchPrompts()
      .then(setPrompts)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const allTags = useMemo(() => {
    const counts = new Map<string, number>()
    for (const p of prompts) {
      for (const t of p.tags ?? []) {
        counts.set(t, (counts.get(t) ?? 0) + 1)
      }
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([tag]) => tag)
  }, [prompts])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return prompts.filter((p) => {
      const matchesTag = activeTag === null || (p.tags ?? []).includes(activeTag)
      if (!matchesTag) return false
      if (!q) return true
      return (
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.tags ?? []).some((t) => t.toLowerCase().includes(q))
      )
    })
  }, [prompts, search, activeTag])

  function toggleTag(tag: string) {
    setActiveTag((prev) => (prev === tag ? null : tag))
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b11]">
      <Header isDark={isDark} onToggleTheme={() => setIsDark((d) => !d)} />

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 bg-gradient-to-b from-slate-900 to-slate-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-white dark:to-slate-400 sm:text-4xl">
            Browse Prompts
          </h1>
          <p className="text-sm text-slate-500">
            {loading ? 'Loading…' : `${prompts.length} prompts ready to use`}
          </p>
        </div>

        {/* Search + filter bar */}
        <div className="mb-6 space-y-3">
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search prompts…"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-9 text-sm text-slate-800 placeholder-slate-400 outline-none transition-colors focus:border-indigo-400 focus:bg-slate-50 focus:ring-1 focus:ring-indigo-400/30 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-slate-200 dark:placeholder-slate-600 dark:focus:border-indigo-500/50 dark:focus:bg-white/[0.05] dark:focus:ring-indigo-500/30"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-600 dark:hover:text-slate-400"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Tag pills */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {allTags.map((tag) => (
                <TagBadge
                  key={tag}
                  tag={tag}
                  active={activeTag === tag}
                  onClick={() => toggleTag(tag)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Results count */}
        {!loading && !error && (search || activeTag) && (
          <p className="mb-4 text-xs text-slate-500 dark:text-slate-600">
            {filtered.length === 0
              ? 'No prompts match your filters'
              : `${filtered.length} prompt${filtered.length === 1 ? '' : 's'} found`}
          </p>
        )}

        {/* State: loading */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={20} className="animate-spin text-slate-400 dark:text-slate-600" />
          </div>
        )}

        {/* State: error */}
        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-center">
            <p className="text-sm text-red-400">{error}</p>
            <p className="mt-1 text-xs text-slate-500">
              Make sure the backend is running on port 8000.
            </p>
          </div>
        )}

        {/* Prompt grid */}
        {!loading && !error && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((prompt) => (
              <PromptCard
                key={prompt.name}
                prompt={prompt}
                selected={selected?.name === prompt.name}
                onClick={() =>
                  setSelected((prev) =>
                    prev?.name === prompt.name ? null : prompt,
                  )
                }
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filtered.length === 0 && !search && !activeTag && (
          <div className="py-24 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-600">No prompts found.</p>
          </div>
        )}
      </main>

      {/* Detail panel */}
      {selected && (
        <PromptDetail prompt={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}
