export interface Prompt {
  name: string
  text: string
  description: string
  tags?: string[]
  meta?: {
    authors?: string[]
    [key: string]: unknown
  }
  version: string
  card?: string
}
