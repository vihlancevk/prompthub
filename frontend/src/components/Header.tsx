import { Github, Sun, Moon } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const NAV_LINKS = [
  { to: '/prompts', label: 'Prompts' },
  { to: '/skills', label: 'Skills' },
]

interface HeaderProps {
  isDark: boolean
  onToggleTheme: () => void
}

export default function Header({ isDark, onToggleTheme }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-xl dark:border-white/[0.06] dark:bg-[#070b11]/80">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo + Nav */}
        <div className="flex items-center gap-6">
          <NavLink to="/" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/25">
              <span className="text-sm font-bold text-white">P</span>
            </div>
            <span className="text-sm font-semibold tracking-tight text-slate-900 dark:text-white">
              PromptHub
            </span>
          </NavLink>

          <nav className="flex items-center gap-1">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Right side: theme toggle + GitHub */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleTheme}
            className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 transition-all duration-150 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-slate-400 dark:hover:border-white/[0.14] dark:hover:bg-white/[0.06] dark:hover:text-white"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          <a
            href="https://github.com/vihlancevk/prompthub"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-all duration-150 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-slate-400 dark:hover:border-white/[0.14] dark:hover:bg-white/[0.06] dark:hover:text-white"
          >
            <Github size={13} />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </header>
  )
}
