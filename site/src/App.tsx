import { useState, useEffect, useRef, useCallback } from "react"
import { Canvas } from "./components/Canvas"
import { useNotes, Note } from "./hooks/useNotes"

function App() {
  const { notes, createNote, updateNote, deleteNote } = useNotes()
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null)
  
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

  const handleCreateNote = (position: { x: number; y: number; width: number; height: number }) => {
    const newNote = createNote(position)
    setActiveNoteId(newNote.id)
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
        const remaining = notes.filter((n) => n.id !== id)
        if (remaining.length > 0) {
          setActiveNoteId(remaining[0].id)
        }
      }
    }
  }

  const handleNoteUpdate = useCallback(
    (id: string, updates: Partial<Note>) => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }

      // Debounce saving
      saveTimeoutRef.current = setTimeout(() => {
        updateNote(id, updates)
      }, 500)
      
      // For immediate UI updates (like dragging), we might want to bypass debounce or handle it in Canvas
      // But useNotes updates state immediately, so debounce is only for persistence if useNotes was persisting to API
      // Here useNotes persists to localStorage in useEffect [notes], so updating state triggers save.
      // The debounce here in App was likely to prevent excessive state updates if typing fast?
      // Actually useNotes implementation:
      // const updateNote = ... setNotes(...)
      // useEffect ... localStorage.setItem
      
      // So calling updateNote triggers re-render and save.
      // We should probably debounce text updates but maybe not position updates?
      // For now, let's just call updateNote directly for position, and keep debounce for text if needed.
      // But the original code debounced updateNote call.
      
      // Let's just call updateNote directly for now to ensure responsiveness of drag.
      // If performance is an issue, we can optimize.
      updateNote(id, updates)
    },
    [updateNote],
  )

  return (
    <div className="app">
      <Canvas
        notes={notes}
        activeNoteId={activeNoteId}
        onSelectNote={setActiveNoteId}
        onCreateNote={handleCreateNote}
        onUpdateNote={updateNote}
        onDeleteNote={handleDeleteNote}
      />
    </div>
  )
}

export default App
