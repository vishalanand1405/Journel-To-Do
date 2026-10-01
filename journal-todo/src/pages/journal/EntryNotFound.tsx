import { Link } from 'react-router-dom'

export default function EntryNotFound() {
  return (
    <div className="page">
      <div className="empty-state">
        <div className="empty-emoji" aria-hidden="true">
          🔍
        </div>
        <h2>Entry not found</h2>
        <p>It may have been deleted, or the link is out of date.</p>
        <Link to="/journal" className="btn btn-secondary">
          Back to journal
        </Link>
      </div>
    </div>
  )
}
