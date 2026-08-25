import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { CardNewPage } from '../pages/CardNewPage'
import { HomePage } from '../pages/HomePage'
import { StudyPage } from '../pages/StudyPage'
import { TopicsPage } from '../pages/TopicsPage'

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/topics" element={<TopicsPage />} />
          <Route path="/cards/new" element={<CardNewPage />} />
          <Route path="/study/random" element={<StudyPage />} />
          <Route path="/study/:topicId" element={<StudyPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
