import BrowsePage from './BrowsePage'
import { fetchPrompts, createPrompt, fetchCard } from '../api'

export default function PromptsPage() {
  return (
    <BrowsePage
      fetchItems={fetchPrompts}
      fetchCard={fetchCard}
      createItem={createPrompt}
      labels={{
        heading: 'Browse Prompts',
        count: (n) => `${n} prompts ready to use`,
        searchPlaceholder: 'Search prompts…',
        noMatch: 'No prompts match your filters',
        empty: 'No prompts found.',
        detailLabel: 'Prompt',
        modal: {
          title: 'Add New Prompt',
          namePlaceholder: 'Name of the prompt',
          textPlaceholder: 'You are a helpful assistant…',
          submitBtn: 'Create Prompt',
        },
      }}
    />
  )
}
