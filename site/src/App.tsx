import { useState, useEffect, useRef, useCallback } from "react"
import { Sidebar } from "./components/Sidebar"
import { Editor } from "./components/Editor"
import { useNotes } from "./hooks/useNotes"

function App() {
  const { notes, createNote, updateNote, deleteNote } = useNotes()
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving">("saved")
  const [metrics, setMetrics] = useState({ charCount: 0, lineCount: 0 })

  const saveTimeoutRef = useRef<number | undefined>(undefined)

  // Initialize with first note if available, or create one
  useEffect(() => {
    if (activeNoteId === null) {
      if (notes.length > 0) {
        setActiveNoteId(notes[0].id)
      } else {
        const newNote = createNote()
        setActiveNoteId(newNote.id)
      }
    }
  }, [notes, activeNoteId, createNote])

  const activeNote = notes.find((n) => n.id === activeNoteId)

  const handleCreateNote = () => {
    const newNote = createNote()
    setActiveNoteId(newNote.id)
    if (window.innerWidth <= 768) {
      setSidebarOpen(false)
    }
  }

  const handleDeleteNote = (id: string) => {
    if (notes.length <= 1) return // Prevent deleting last note

    const index = notes.findIndex((n) => n.id === id)
    deleteNote(id)

    if (id === activeNoteId) {
      const newActiveIndex = index === 0 ? 1 : index - 1
      if (notes[newActiveIndex]) {
        setActiveNoteId(notes[newActiveIndex].id)
      } else if (notes.length > 1) {
        // If we deleted the only note (length check above prevents this but strictly speaking)
        // logic above handles > 1.
        // If we deleted one and there are others, we pick one.
        // We need to check existing notes array, but we are inside the function so `notes` is old state.
        // Actually, better to let the effect handle "if activeNoteId is not found".
        // But the effect only runs if activeNoteId is null.

        // Let's rely on finding the next best note.
        // Since we are using state setter for delete, we can't easily predict next state here without logic.
        // But we have `notes` in scope.
        const remaining = notes.filter((n) => n.id !== id)
        if (remaining.length > 0) {
          setActiveNoteId(remaining[0].id)
        }
      }
    }
  }

  const handleNoteUpdate = useCallback(
    (id: string, updates: { title?: string; content?: string }) => {
      setSaveStatus("saving")

      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }

      saveTimeoutRef.current = setTimeout(() => {
        updateNote(id, updates)
        setSaveStatus("saved")
      }, 500)
    },
    [updateNote],
  )

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (activeNoteId) {
      // Optimistically update UI?
      // The Sidebar title update depends on `notes` state.
      // If we debounce, sidebar won't update immediately.
      // For title, maybe we want immediate update?
      // Or we accept the delay.
      // Let's debounce content, but maybe update title immediately?
      // Original app debounced both.
      // To keep Sidebar responsive, we might want to update local state immediately if we had a local state for the active note.
      // Since we rely on `notes` as source of truth, the sidebar will lag.
      // This is acceptable for now.
      handleNoteUpdate(activeNoteId, { title: e.target.value })
    }
  }

  const handleContentChange = useCallback(
    (content: string) => {
      if (activeNoteId) {
        handleNoteUpdate(activeNoteId, { content })
      }
    },
    [activeNoteId, handleNoteUpdate],
  )

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  const handleMetricsChange = useCallback(
    (charCount: number, lineCount: number) => {
      setMetrics({ charCount, lineCount })
    },
    [],
  )

  // Update metrics when active note changes
  useEffect(() => {
    if (activeNote) {
      setMetrics({
        charCount: activeNote.content.length,
        lineCount: activeNote.content.split("\n").length,
      })
    }
  }, [activeNoteId]) // Only reset when ID changes, actual updates come from Editor callback

  return (
    <div className="app">
      <Sidebar
        notes={notes}
        activeNoteId={activeNoteId}
        onSelectNote={(id) => {
          setActiveNoteId(id)
          if (window.innerWidth <= 768) {
            setSidebarOpen(false)
          }
        }}
        onDeleteNote={handleDeleteNote}
        onCreateNote={handleCreateNote}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        saving={saveStatus === "saving"}
      />

      <main className="main">
        <header className="editor-header">
          <button
            className="mobile-toggle"
            onClick={toggleSidebar}
            aria-label="Open sidebar"
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <input
            type="text"
            className="editor-title-input"
            key={activeNote?.id}
            defaultValue={activeNote?.title || ""}
            onChange={handleTitleChange}
            placeholder="Untitled Note"
            disabled={!activeNote}
          />
          <div className="editor-meta">
            <span>{metrics.charCount} chars</span>
            <span>{metrics.lineCount} lines</span>
          </div>
        </header>

        {activeNote ? (
          <Editor
            // Key is crucial to reset editor when note changes
            key={activeNote.id}
            initialContent={activeNote.content}
            onChange={handleContentChange}
            onMetricsChange={handleMetricsChange}
          />
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📝</div>
            <div className="empty-state-title">No Note Selected</div>
            <div className="empty-state-text">
              Select a note from the sidebar or create a new one.
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
