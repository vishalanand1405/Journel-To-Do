import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeftIcon } from '../../components/Icons'
import EntryForm from '../../components/journal/EntryForm'
import { emptyEntry, hasContent } from '../../journal/entry'
import { clearDraft, loadDraft, saveDraft } from '../../journal/storage'
import type { EntryInput } from '../../journal/types'
import { useJournal } from '../../journal/useJournal'
import { todayISO } from '../../lib/dates'

type DraftStatus = 'none' | 'restored' | 'saved'

export default function NewEntryPage() {
  const { addEntry } = useJournal()
  const navigate = useNavigate()
  const [savedDraft] = useState(loadDraft)
  const [status, setStatus] = useState<DraftStatus>(savedDraft && hasContent(savedDraft) ? 'restored' : 'none')

  const autosave = (input: EntryInput) => {
    if (hasContent(input)) {
      saveDraft(input)
      setStatus('saved')
    } else {
      clearDraft()
      setStatus('none')
    }
  }

  const save = (input: EntryInput) => {
    const entry = addEntry(input)
    clearDraft()
    navigate(`/journal/${entry.id}`, { replace: true })
  }

  return (
    <div className="page">
      <div className="page-toolbar">
        <Link to="/journal" className="back-link">
          <ArrowLeftIcon width={16} height={16} />
          Journal
        </Link>
      </div>
      <EntryForm
        initial={savedDraft ?? emptyEntry(todayISO())}
        submitLabel="Save entry"
        onChange={autosave}
        onSubmit={save}
        onCancel={() => navigate('/journal')}
        status={
          status !== 'none' && (
            <span className="save-status">
              <span className="save-dot" />
              {status === 'restored' ? 'Draft restored' : 'Draft saved'}
            </span>
          )
        }
      />
    </div>
  )
}
