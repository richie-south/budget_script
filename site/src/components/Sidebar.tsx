import React from "react"
import { Note } from "../hooks/useNotes"
import imgUrl from "/icons/logo.png"

interface SidebarProps {
  notes: Note[]
  activeNoteId: string | null
  onSelectNote: (id: string) => void
  onDeleteNote: (id: string) => void
  onCreateNote: () => void
  isOpen: boolean
  onClose: () => void
  saving: boolean
}

export function Sidebar({
  notes,
  activeNoteId,
  onSelectNote,
  onDeleteNote,
  onCreateNote,
  isOpen,
  onClose,
  saving,
}: SidebarProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()

    if (diff < 60000) return "Just now"
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? "visible" : ""}`}
        onClick={onClose}
      />
      <aside className={`sidebar ${isOpen ? "open" : ""}`} id="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <img src={imgUrl} width={36} height={36} alt="Budget Script" style={{ borderRadius: '8px' }} />
            <span className="logo-text">Budget Script</span>
          </div>
          <button
            className="sidebar-close"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="notes-section">
          <div className="section-header">
            <span className="section-title">Notes</span>
            <button className="btn-new" onClick={onCreateNote}>
              + New
            </button>
          </div>
          <div className="notes-list">
            {notes.map((note) => {
              const preview =
                note.content.split("\n")[0].slice(0, 50) || "Empty note"
              const isActive = note.id === activeNoteId

              return (
                <div
                  key={note.id}
                  className={`note-item ${isActive ? "active" : ""}`}
                  onClick={() => onSelectNote(note.id)}
                >
                  <div className="note-item-header">
                    <span className="note-title">{note.title}</span>
                    <span className="note-date">
                      {formatDate(note.updatedAt)}
                    </span>
                  </div>
                  <div className="note-preview">{preview}</div>
                  <div className="note-actions">
                    <button
                      className="btn-delete"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteNote(note.id)
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="sidebar-footer">
          <div className={`save-indicator ${saving ? "saving" : ""}`} />
          <span className="save-text">
            {saving ? "Saving..." : "Auto-saved"}
          </span>
        </div>
      </aside>
    </>
  )
}
