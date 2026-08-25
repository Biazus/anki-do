import { apiFetch } from './client'
import type { Card, CardCreate } from '../types/card'

export function fetchCardsByTopic(topicId: number): Promise<Card[]> {
  return apiFetch(`/cards?topic_id=${topicId}`)
}

export function fetchRandomCards(): Promise<Card[]> {
  return apiFetch('/cards?random=true')
}

export function createCard(payload: CardCreate): Promise<Card> {
  return apiFetch('/cards', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
