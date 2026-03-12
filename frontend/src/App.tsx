import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import WelcomePage from './pages/WelcomePage'
import PromptsPage from './pages/PromptsPage'
import SkillsPage from './pages/SkillsPage'

export default function App() {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('theme')
    return stored ? stored === 'dark' : true
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b11]">
      <Header isDark={isDark} onToggleTheme={() => setIsDark((d) => !d)} />
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/prompts" element={<PromptsPage />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
