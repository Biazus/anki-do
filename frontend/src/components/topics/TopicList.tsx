import type { Topic } from '../../types/topic'

interface TopicListProps {
  topics: Topic[]
}

export function TopicList({ topics }: TopicListProps) {
  return (
    <ul className="topic-list">
      {topics.map((topic) => (
        <li key={topic.id} className="topic-list__item">
          <span className="topic-list__name">{topic.name}</span>
          <span className="topic-list__count">
            {topic.card_count ?? 0} {topic.card_count === 1 ? 'card' : 'cards'}
          </span>
        </li>
      ))}
    </ul>
  )
}
