import type { Prompt } from './types'

const BASE = '/api'

export async function fetchPrompts(): Promise<Prompt[]> {
  const res = await fetch(`${BASE}/prompts`)
  if (!res.ok) throw new Error(`Failed to fetch prompts: ${res.status}`)
  return res.json()
}

export async function fetchPrompt(authorName: string, name: string): Promise<Prompt> {
  const res = await fetch(`${BASE}/prompts/${authorName}/${name}`)
  if (!res.ok) throw new Error(`Failed to fetch prompt: ${res.status}`)
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
