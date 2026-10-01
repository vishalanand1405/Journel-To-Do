import { useEffect } from 'react'
import { useJournal } from '../../journal/useJournal'
import { XIcon } from '../Icons'

const TOAST_MS = 6000

export default function UndoToast() {
  const { lastDeleted, undoDelete, dismissUndo } = useJournal()

  useEffect(() => {
    if (!lastDeleted) return
    const timer = setTimeout(dismissUndo, TOAST_MS)
    return () => clearTimeout(timer)
  }, [lastDeleted, dismissUndo])

  if (!lastDeleted) return null

  return (
    <div className="toast" role="status">
      <span>
        Deleted <strong>{lastDeleted.title || 'Untitled entry'}</strong>
      </span>
      <button type="button" className="toast-action" onClick={undoDelete}>
        Undo
      </button>
      <button type="button" className="icon-btn small" onClick={dismissUndo} aria-label="Dismiss">
        <XIcon width={14} height={14} />
      </button>
    </div>
  )
}
