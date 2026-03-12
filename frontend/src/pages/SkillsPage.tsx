import BrowsePage from './BrowsePage'
import { fetchSkills, createSkill, fetchSkillCard } from '../api'

export default function SkillsPage() {
  return (
    <BrowsePage
      fetchItems={fetchSkills}
      fetchCard={fetchSkillCard}
      createItem={createSkill}
      labels={{
        heading: 'Browse Skills',
        count: (n) => `${n} skills ready to use`,
        searchPlaceholder: 'Search skills…',
        noMatch: 'No skills match your filters',
        empty: 'No skills found.',
        detailLabel: 'Skill',
        modal: {
          title: 'Add New Skill',
          namePlaceholder: 'Name of the skill',
          textPlaceholder: 'Skill definition…',
          submitBtn: 'Create Skill',
        },
      }}
    />
  )
}
