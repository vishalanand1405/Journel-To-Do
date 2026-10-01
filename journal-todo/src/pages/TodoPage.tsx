export default function TodoPage() {
  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Coming soon</p>
          <h1 className="page-title">Todo</h1>
          <p className="page-subtitle">Things to get done.</p>
        </div>
      </header>
      <div className="empty-state">
        <div className="empty-emoji" aria-hidden="true">
          ✅
        </div>
        <h2>Nothing on your list</h2>
        <p>Tasks will live here. Enjoy the calm for now.</p>
      </div>
    </div>
  )
}
