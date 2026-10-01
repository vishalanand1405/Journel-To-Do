import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import { JournalProvider } from './journal/JournalProvider'
import EditEntryPage from './pages/journal/EditEntryPage'
import EntryPage from './pages/journal/EntryPage'
import JournalListPage from './pages/journal/JournalListPage'
import NewEntryPage from './pages/journal/NewEntryPage'
import TodoPage from './pages/TodoPage'

export default function App() {
  return (
    <JournalProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/journal" replace />} />
          <Route path="journal" element={<JournalListPage />} />
          <Route path="journal/new" element={<NewEntryPage />} />
          <Route path="journal/:id" element={<EntryPage />} />
          <Route path="journal/:id/edit" element={<EditEntryPage />} />
          <Route path="todo" element={<TodoPage />} />
          <Route path="*" element={<Navigate to="/journal" replace />} />
        </Route>
      </Routes>
    </JournalProvider>
  )
}
