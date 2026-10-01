import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeftIcon } from '../../components/Icons'
import EntryForm from '../../components/journal/EntryForm'
import { toInput } from '../../journal/entry'
import { useJournal } from '../../journal/useJournal'
import EntryNotFound from './EntryNotFound'

export default function EditEntryPage() {
  const { id = '' } = useParams()
  const { getEntry, updateEntry } = useJournal()
  const navigate = useNavigate()
  const entry = getEntry(id)

  if (!entry) return <EntryNotFound />

  return (
    <div className="page">
      <div className="page-toolbar">
        <Link to={`/journal/${id}`} className="back-link">
          <ArrowLeftIcon width={16} height={16} />
          Back to entry
        </Link>
      </div>
      <EntryForm
        key={id}
        initial={toInput(entry)}
        submitLabel="Save changes"
        onSubmit={(input) => {
          updateEntry(id, input)
          navigate(`/journal/${id}`, { replace: true })
        }}
        onCancel={() => navigate(`/journal/${id}`)}
      />
    </div>
  )
}
