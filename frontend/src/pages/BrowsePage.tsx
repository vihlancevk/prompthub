import { useEffect, useMemo, useState } from 'react'
import { Search, X, Loader2, Plus } from 'lucide-react'
import type { Prompt } from '../types'
import TagBadge from '../components/TagBadge'
import ItemCard from '../components/ItemCard'
import ItemDetail from '../components/ItemDetail'
import CreateItemModal from '../components/CreateItemModal'

interface BrowseLabels {
  heading: string
  count: (n: number) => string
  searchPlaceholder: string
  noMatch: string
  empty: string
  detailLabel: string
  modal: {
    title: string
    namePlaceholder: string
    textPlaceholder: string
    submitBtn: string
  }
}

interface BrowsePageProps {
  fetchItems: () => Promise<Prompt[]>
  fetchCard: (author: string, name: string) => Promise<string>
  createItem: (item: Prompt) => Promise<Prompt>
  labels: BrowseLabels
}

function isSameItem(a: Prompt | null, b: Prompt): boolean {
  return a?.name === b.name && a?.author_name === b.author_name
}

export default function BrowsePage({ fetchItems, fetchCard, createItem, labels }: BrowsePageProps) {
  const [items, setItems] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [selected, setSelected] = useState<Prompt | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  useEffect(() => {
    fetchItems()
      .then(setItems)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [fetchItems])

  const allTags = useMemo(() => {
    const counts = new Map<string, number>()
    for (const item of items) {
      for (const t of item.tags ?? []) {
        counts.set(t, (counts.get(t) ?? 0) + 1)
      }
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([tag]) => tag)
  }, [items])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return items.filter((item) => {
      if (activeTag !== null && !(item.tags ?? []).includes(activeTag)) return false
      if (!q) return true
      return (
        item.name.toLowerCase().includes(q) ||
        item.author_name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.tags ?? []).some((t) => t.toLowerCase().includes(q))
      )
    })
  }, [items, search, activeTag])

  return (
    <>
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="mb-2 bg-gradient-to-b from-slate-900 to-slate-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-white dark:to-slate-400 sm:text-4xl">
            {labels.heading}
          </h1>
          <p className="text-sm text-slate-500">
            {loading ? 'Loading…' : labels.count(items.length)}
          </p>
        </div>

        <div className="mb-6 space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={labels.searchPlaceholder}
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
            <button
              onClick={() => setShowCreate(true)}
              className="flex shrink-0 items-center gap-1.5 rounded-xl border border-indigo-500/30 bg-indigo-600/10 px-3.5 py-2.5 text-sm font-medium text-indigo-500 transition-colors hover:bg-indigo-600/20 dark:border-indigo-500/20 dark:text-indigo-400"
            >
              <Plus size={15} />
              Add
            </button>
          </div>

          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {allTags.map((tag) => (
                <TagBadge
                  key={tag}
                  tag={tag}
                  active={activeTag === tag}
                  onClick={() => setActiveTag((prev) => (prev === tag ? null : tag))}
                />
              ))}
            </div>
          )}
        </div>

        {!loading && !error && (search || activeTag) && (
          <p className="mb-4 text-xs text-slate-500 dark:text-slate-600">
            {filtered.length === 0 ? labels.noMatch : `${filtered.length} found`}
          </p>
        )}

        {loading && (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={20} className="animate-spin text-slate-400 dark:text-slate-600" />
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-center">
            <p className="text-sm text-red-400">{error}</p>
            <p className="mt-1 text-xs text-slate-500">Make sure the backend is running on port 8000.</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => (
              <ItemCard
                key={`${item.author_name}/${item.name}`}
                item={item}
                selected={isSameItem(selected, item)}
                onClick={() => setSelected((prev) => isSameItem(prev, item) ? null : item)}
              />
            ))}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && !search && !activeTag && (
          <div className="py-24 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-600">{labels.empty}</p>
          </div>
        )}
      </main>

      {selected && (
        <ItemDetail
          item={selected}
          onClose={() => setSelected(null)}
          fetchCard={fetchCard}
          label={labels.detailLabel}
        />
      )}

      {showCreate && (
        <CreateItemModal
          onClose={() => setShowCreate(false)}
          onCreated={(item) => setItems((prev) => [item, ...prev])}
          createFn={createItem}
          labels={labels.modal}
        />
      )}
    </>
  )
}
