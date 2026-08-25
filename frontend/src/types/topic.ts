export interface Topic {
  id: number
  name: string
  card_count: number | null
  created_at: string
}

export interface TopicCreate {
  name: string
}
