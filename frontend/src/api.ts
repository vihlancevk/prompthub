import type { Prompt, Skill } from './types'

const BASE = '/api'

export async function fetchPrompts(): Promise<Prompt[]> {
  const res = await fetch(`${BASE}/prompts`)
  if (!res.ok) throw new Error(`Failed to fetch prompts: ${res.status}`)
  return res.json()
}

export async function createPrompt(prompt: Prompt): Promise<Prompt> {
  const res = await fetch(`${BASE}/prompts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(prompt),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `Failed to create prompt: ${res.status}`)
  }
  return res.json()
}

export async function fetchCard(authorName: string, name: string): Promise<string> {
  const res = await fetch(`${BASE}/cards/${authorName}/${name}`)
  if (!res.ok) return ''
  return res.text()
}

export async function fetchSkills(): Promise<Skill[]> {
  const res = await fetch(`${BASE}/skills`)
  if (!res.ok) throw new Error(`Failed to fetch skills: ${res.status}`)
  return res.json()
}

export async function createSkill(skill: Skill): Promise<Skill> {
  const res = await fetch(`${BASE}/skills`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(skill),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `Failed to create skill: ${res.status}`)
  }
  return res.json()
}

export async function fetchSkillCard(authorName: string, name: string): Promise<string> {
  const res = await fetch(`${BASE}/skill-cards/${authorName}/${name}`)
  if (!res.ok) return ''
  return res.text()
}
