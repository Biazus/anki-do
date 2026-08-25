import { apiFetch } from './client'
import type { Topic, TopicCreate } from '../types/topic'

export function fetchTopics(): Promise<Topic[]> {
  return apiFetch('/topics')
}

export function createTopic(payload: TopicCreate): Promise<Topic> {
  return apiFetch('/topics', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
