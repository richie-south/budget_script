import { useState, useEffect, useRef, useCallback } from "react"
import { Canvas } from "./components/Canvas"
import { useCanvases, Note } from "./hooks/useCanvases"

function App() {
  const { 
    canvases, 
    activeCanvasId, 
    activeCanvas, 
    setActiveCanvasId, 
    createCanvas, 
    deleteCanvas, 
    updateCanvasName,
    createNote, 
    updateNote, 
    deleteNote 
  } = useCanvases()
  
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null)
  
  const saveTimeoutRef = useRef<number | undefined>(undefined)

  // Initialize with first note if available, or create one
  useEffect(() => {
    if (activeNoteId === null && activeCanvas) {
      if (activeCanvas.notes.length > 0) {
        setActiveNoteId(activeCanvas.notes[0].id)
      } else {
        // Only create note if canvas is empty and it's the very first load?
        // Actually, let's not auto-create note for now, or maybe only if the canvas is brand new?
        // The original logic was: if (notes.length > 0) setActive else createNote
        // If we create a new canvas, it starts empty. Maybe we should create a default note?
        if (activeCanvas.notes.length === 0) {
           const newNote = createNote()
           setActiveNoteId(newNote.id)
        }
      }
    }
  }, [activeCanvas, activeNoteId, createNote])

  // Reset active note when canvas changes
  useEffect(() => {
    // If we switch canvas, we should probably select the first note of the new canvas
    // or null if empty.
    // The previous effect handles the "null" case by selecting first or creating.
    // So here we just set to null to trigger that effect?
    // But we need to be careful about dependency loops.
    
    // Let's just find if the current activeNoteId is in the new activeCanvas.
    // If not, reset.
    if (activeCanvas) {
        const noteExists = activeCanvas.notes.find(n => n.id === activeNoteId)
        if (!noteExists) {
            setActiveNoteId(null)
        }
    }
  }, [activeCanvasId, activeCanvas]) // activeCanvas changes when activeCanvasId changes

  const handleCreateNote = (position: { x: number; y: number; width: number; height: number }) => {
    const newNote = createNote(position)
    setActiveNoteId(newNote.id)
  }

  const handleDeleteNote = (id: string) => {
    if (!activeCanvas || activeCanvas.notes.length <= 1) return // Prevent deleting last note

    const index = activeCanvas.notes.findIndex((n) => n.id === id)
    deleteNote(id)

    if (id === activeNoteId) {
      const newActiveIndex = index === 0 ? 1 : index - 1
      if (activeCanvas.notes[newActiveIndex]) {
        setActiveNoteId(activeCanvas.notes[newActiveIndex].id)
      } else if (activeCanvas.notes.length > 1) {
        const remaining = activeCanvas.notes.filter((n) => n.id !== id)
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
      
      updateNote(id, updates)
    },
    [updateNote],
  )

  if (!activeCanvas) return <div>Loading...</div>

  return (
    <div className="app">
      <Canvas
        notes={activeCanvas.notes}
        activeNoteId={activeNoteId}
        onSelectNote={setActiveNoteId}
        onCreateNote={handleCreateNote}
        onUpdateNote={updateNote}
        onDeleteNote={handleDeleteNote}
        canvases={canvases}
        activeCanvasId={activeCanvasId}
        onSelectCanvas={setActiveCanvasId}
        onCreateCanvas={createCanvas}
        onDeleteCanvas={deleteCanvas}
        onUpdateCanvasName={updateCanvasName}
      />
    </div>
  )
}

export default App
