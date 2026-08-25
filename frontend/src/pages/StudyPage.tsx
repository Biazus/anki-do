import { useLocation, useParams } from 'react-router-dom'
import { PageHeader } from '../components/layout/PageHeader'

export function StudyPage() {
  const { topicId } = useParams()
  const location = useLocation()
  const isRandom = location.pathname === '/study/random'

  const subtitle = isRandom
    ? 'Modo aleatório — todos os tópicos.'
    : `Estudando tópico #${topicId}.`

  return (
    <section>
      <PageHeader title="Estudo" subtitle={subtitle} />
      <p>Em breve: sessão de flashcards.</p>
    </section>
  )
}
