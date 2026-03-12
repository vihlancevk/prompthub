import { useNavigate } from 'react-router-dom'
import { MessageSquare, Zap, ArrowRight } from 'lucide-react'

export default function WelcomePage() {
  const navigate = useNavigate()

  return (
    <main className="mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="mb-16 text-center">
        <h1 className="mb-4 bg-gradient-to-b from-slate-900 to-slate-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent dark:from-white dark:to-slate-400 sm:text-5xl">
          Welcome to PromptHub
        </h1>
        <p className="mx-auto max-w-xl text-base text-slate-500 dark:text-slate-400">
          A collection of ready-made NLP prompts and reusable skills. Browse, copy, and use them in your projects.
        </p>
      </div>

      {/* Navigation cards */}
      <div className="mx-auto grid max-w-2xl gap-4 sm:grid-cols-2">
        {/* Prompts card */}
        <button
          onClick={() => navigate('/prompts')}
          className="group flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 text-left transition-all duration-150 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/10 dark:border-white/[0.08] dark:bg-white/[0.02] dark:hover:border-indigo-500/40 dark:hover:bg-indigo-500/[0.04]"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-500/10">
            <MessageSquare size={22} className="text-indigo-500 dark:text-indigo-400" />
          </div>
          <div className="flex-1">
            <h2 className="mb-1 text-base font-semibold text-slate-900 dark:text-white">Prompts</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Ready-to-use prompt templates for LLMs. Search, filter by tag, and copy with one click.
            </p>
          </div>
          <div className="flex items-center gap-1 text-sm font-medium text-indigo-600 dark:text-indigo-400">
            Browse Prompts
            <ArrowRight size={15} className="transition-transform duration-150 group-hover:translate-x-0.5" />
          </div>
        </button>

        {/* Skills card */}
        <button
          onClick={() => navigate('/skills')}
          className="group flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 text-left transition-all duration-150 hover:border-violet-300 hover:shadow-lg hover:shadow-violet-500/10 dark:border-white/[0.08] dark:bg-white/[0.02] dark:hover:border-violet-500/40 dark:hover:bg-violet-500/[0.04]"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-500/10">
            <Zap size={22} className="text-violet-500 dark:text-violet-400" />
          </div>
          <div className="flex-1">
            <h2 className="mb-1 text-base font-semibold text-slate-900 dark:text-white">Skills</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Reusable skill definitions for AI agents. Explore capabilities and integrate them into your workflows.
            </p>
          </div>
          <div className="flex items-center gap-1 text-sm font-medium text-violet-600 dark:text-violet-400">
            Browse Skills
            <ArrowRight size={15} className="transition-transform duration-150 group-hover:translate-x-0.5" />
          </div>
        </button>
      </div>
    </main>
  )
}
