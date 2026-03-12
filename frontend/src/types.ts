export interface Prompt {
  name: string
  author_name: string
  version: string
  tags?: string[]
  description: string
  text: string
  card?: string
}

export type Skill = Prompt
