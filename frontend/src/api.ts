import type { Prompt } from './types'

const BASE = '/api'

export async function fetchPrompts(): Promise<Prompt[]> {
  const res = await fetch(`${BASE}/prompts`)
  if (!res.ok) throw new Error(`Failed to fetch prompts: ${res.status}`)
  return res.json()
}

export async function fetchPrompt(name: string): Promise<Prompt> {
  const res = await fetch(`${BASE}/prompts/${name}`)
  if (!res.ok) throw new Error(`Failed to fetch prompt: ${res.status}`)
  return res.json()
}

export async function fetchCard(name: string): Promise<string> {
  const res = await fetch(`${BASE}/cards/${name}`)
  if (!res.ok) return ''
  return res.text()
}
