export interface Card {
  id: number
  topic_id: number
  question: string
  answer: string
  extended_description: string | null
  created_at: string
}

export interface CardCreate {
  topic_id: number
  question: string
  answer: string
  extended_description?: string | null
}
