import React, { useState, useRef, useCallback, useEffect } from "react"
import { Canvas as CanvasType, Note } from "../hooks/useCanvases"
import { Editor } from "./Editor"

interface CanvasProps {
  notes: Note[]
  activeNoteId: string | null
  onSelectNote: (id: string) => void
  onCreateNote: (position: {
    x: number
    y: number
    width: number
    height: number
  }) => void
  onUpdateNote: (id: string, updates: Partial<Note>) => void
  onDeleteNote: (id: string) => void

  canvases: CanvasType[]
  activeCanvasId: string
  onSelectCanvas: (id: string) => void
  onCreateCanvas: () => void
  onDeleteCanvas: (id: string) => void
  onUpdateCanvasName: (id: string, name: string) => void
}

type Tool = "select" | "create"
type DragMode = "create" | "move" | "resize" | null

const GRID_SIZE = 20
const MIN_SIZE = GRID_SIZE * 4

function snap(value: number) {
  return Math.round(value / GRID_SIZE) * GRID_SIZE
}

export function Canvas({
  notes,
  activeNoteId,
  onSelectNote,
  onCreateNote,
  onUpdateNote,
  onDeleteNote,
  canvases,
  activeCanvasId,
  onSelectCanvas,
  onCreateCanvas,
  onDeleteCanvas,
  onUpdateCanvasName,
}: CanvasProps) {
  const [tool, setTool] = useState<Tool>("select")
  const [dragMode, setDragMode] = useState<DragMode>(null)
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null,
  )
  const [currentDrag, setCurrentDrag] = useState<{
    x: number
    y: number
  } | null>(null)
  const [activeDragNoteId, setActiveDragNoteId] = useState<string | null>(null)

  const canvasRef = useRef<HTMLDivElement>(null)

  // Refs so document-level event listeners always see fresh values
  const stateRef = useRef({
    dragMode,
    dragStart,
    currentDrag,
    activeDragNoteId,
    notes,
    tool,
  })
  stateRef.current = {
    dragMode,
    dragStart,
    currentDrag,
    activeDragNoteId,
    notes,
    tool,
  }

  const callbacksRef = useRef({ onCreateNote, onUpdateNote })
  callbacksRef.current = { onCreateNote, onUpdateNote }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeNoteId) return
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === "INPUT" || tag === "TEXTAREA") return
      if (e.key === "1") setTool("select")
      else if (e.key === "2") setTool("create")
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [activeNoteId])

  const getMousePos = useCallback((e: MouseEvent | React.MouseEvent) => {
    if (!canvasRef.current) return { x: 0, y: 0 }
    const rect = canvasRef.current.getBoundingClientRect()
    return {
      x: e.clientX - rect.left + canvasRef.current.scrollLeft,
      y: e.clientY - rect.top + canvasRef.current.scrollTop,
    }
  }, [])

  const endDrag = useCallback(() => {
    setDragMode(null)
    setDragStart(null)
    setCurrentDrag(null)
    setActiveDragNoteId(null)
    document.body.style.userSelect = ""
    document.body.style.cursor = ""
  }, [])

  // Robust drag: attach listeners to document so nothing can steal focus
  useEffect(() => {
    if (!dragMode) return

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault()
      const pos = getMousePos(e)
      const mode = stateRef.current.dragMode
      setCurrentDrag(
        mode === "create" ? { x: snap(pos.x), y: snap(pos.y) } : pos,
      )
    }

    const handleMouseUp = (e: MouseEvent) => {
      const {
        dragMode: mode,
        dragStart: start,
        activeDragNoteId: noteId,
        notes: currentNotes,
      } = stateRef.current
      const pos = getMousePos(e)
      const final = mode === "create" ? { x: snap(pos.x), y: snap(pos.y) } : pos

      if (mode === "create" && start) {
        const x = Math.min(start.x, final.x)
        const y = Math.min(start.y, final.y)
        const width = Math.max(Math.abs(final.x - start.x), MIN_SIZE)
        const height = Math.max(Math.abs(final.y - start.y), MIN_SIZE)
        callbacksRef.current.onCreateNote({ x, y, width, height })
        setTool("select")
      } else if (mode === "move" && noteId && start) {
        const note = currentNotes.find((n) => n.id === noteId)
        if (note) {
          callbacksRef.current.onUpdateNote(noteId, {
            x: snap(note.x + final.x - start.x),
            y: snap(note.y + final.y - start.y),
          })
        }
      } else if (mode === "resize" && noteId && start) {
        const note = currentNotes.find((n) => n.id === noteId)
        if (note) {
          callbacksRef.current.onUpdateNote(noteId, {
            width: Math.max(MIN_SIZE, snap(note.width + final.x - start.x)),
            height: Math.max(MIN_SIZE, snap(note.height + final.y - start.y)),
          })
        }
      }

      endDrag()
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [dragMode, getMousePos, endDrag])

  const beginDrag = (
    e: React.MouseEvent,
    mode: "move" | "resize",
    noteId: string,
  ) => {
    if (tool !== "select") return
    e.preventDefault()
    e.stopPropagation()
    if (mode === "move") onSelectNote(noteId)
    setDragMode(mode)
    setActiveDragNoteId(noteId)
    const pos = getMousePos(e)
    setDragStart(pos)
    setCurrentDrag(pos)
    document.body.style.userSelect = "none"
    document.body.style.cursor = mode === "move" ? "grabbing" : "se-resize"
  }

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (tool === "create") {
      e.preventDefault()
      const pos = getMousePos(e)
      setDragMode("create")
      setDragStart({ x: snap(pos.x), y: snap(pos.y) })
      setCurrentDrag({ x: snap(pos.x), y: snap(pos.y) })
      document.body.style.userSelect = "none"
      document.body.style.cursor = "crosshair"
    } else if (e.target === canvasRef.current) {
      onSelectNote("")
    }
  }

  const renderGhostBox = () => {
    if (dragMode !== "create" || !dragStart || !currentDrag) return null

    const x = Math.min(dragStart.x, currentDrag.x)
    const y = Math.min(dragStart.y, currentDrag.y)
    const width = Math.abs(currentDrag.x - dragStart.x)
    const height = Math.abs(currentDrag.y - dragStart.y)

    return (
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          width,
          height,
          border: "2px dashed var(--accent)",
          backgroundColor: "var(--accent-bg)",
          pointerEvents: "none",
          zIndex: 999,
        }}
      />
    )
  }

  return (
    <div className="canvas-container">
      <div className="toolbar">
        <button
          className={`tool-btn ${tool === "select" ? "active" : ""}`}
          onClick={() => setTool("select")}
          title="Select Tool (1)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
            <path d="M13 13l6 6" />
          </svg>
          <span className="tool-shortcut">1</span>
        </button>
        <button
          className={`tool-btn ${tool === "create" ? "active" : ""}`}
          onClick={() => setTool("create")}
          title="Create Note Tool (2)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          </svg>
          <span className="tool-shortcut">2</span>
        </button>

        <div className="toolbar-divider" />

        <div className="canvas-list">
          {canvases.map((canvas) => {
            const isActive = activeCanvasId === canvas.id
            return (
              <div
                key={canvas.id}
                className={`canvas-tab ${isActive ? "active" : ""}`}
                onClick={() => onSelectCanvas(canvas.id)}
              >
                <input
                  className="canvas-name-input"
                  value={canvas.name}
                  readOnly={!isActive}
                  onChange={(e) => onUpdateCanvasName(canvas.id, e.target.value)}
                  onClick={(e) => {
                    if (isActive) e.stopPropagation()
                  }}
                  onMouseDown={(e) => {
                    if (isActive) e.stopPropagation()
                  }}
                />
                {canvases.length > 1 && (
                  <button
                    className="canvas-delete-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteCanvas(canvas.id)
                    }}
                    title="Delete Canvas"
                  >
                    ×
                  </button>
                )}
              </div>
            )
          })}
          <button
            className="add-canvas-btn"
            onClick={onCreateCanvas}
            title="New Canvas"
          >
            +
          </button>
        </div>
      </div>

      <div
        ref={canvasRef}
        className="canvas-area"
        style={{
          backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
          backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.08) 1.5px, transparent 1.5px)`,
          cursor: tool === "create" ? "crosshair" : "default",
        }}
        onMouseDown={handleCanvasMouseDown}
      >
        {notes.map((note) => {
          const isBeingDragged =
            activeDragNoteId === note.id && dragStart && currentDrag

          let noteStyle: React.CSSProperties = {
            left: note.x,
            top: note.y,
            width: note.width,
            height: note.height,
          }

          if (isBeingDragged) {
            const dx = currentDrag.x - dragStart.x
            const dy = currentDrag.y - dragStart.y
            if (dragMode === "move") {
              noteStyle.left = note.x + dx
              noteStyle.top = note.y + dy
              noteStyle.opacity = 0.9
              noteStyle.zIndex = 50
            } else if (dragMode === "resize") {
              noteStyle.width = Math.max(MIN_SIZE, note.width + dx)
              noteStyle.height = Math.max(MIN_SIZE, note.height + dy)
            }
          }

          return (
            <NoteBox
              key={note.id}
              note={note}
              isActive={activeNoteId === note.id}
              style={noteStyle}
              interactionDisabled={!!dragMode}
              onDragStart={(e) => beginDrag(e, "move", note.id)}
              onSelect={() => onSelectNote(note.id)}
              onResizeStart={(e) => beginDrag(e, "resize", note.id)}
              onUpdateContent={(content) => onUpdateNote(note.id, { content })}
              onUpdateTitle={(title) => onUpdateNote(note.id, { title })}
              onDelete={() => onDeleteNote(note.id)}
            />
          )
        })}
        {renderGhostBox()}
      </div>
    </div>
  )
}

interface NoteBoxProps {
  note: Note
  isActive: boolean
  style: React.CSSProperties
  interactionDisabled: boolean
  onDragStart: (e: React.MouseEvent) => void
  onSelect: () => void
  onResizeStart: (e: React.MouseEvent) => void
  onUpdateContent: (content: string) => void
  onUpdateTitle: (title: string) => void
  onDelete: () => void
}

function NoteBox({
  note,
  isActive,
  style,
  interactionDisabled,
  onDragStart,
  onSelect,
  onResizeStart,
  onUpdateContent,
  onUpdateTitle,
  onDelete,
}: NoteBoxProps) {
  return (
    <div
      className={`note-box ${isActive ? "active" : ""}`}
      style={{
        ...style,
        position: "absolute",
        pointerEvents: interactionDisabled ? "none" : "auto",
      }}
      onMouseDownCapture={() => onSelect()}
    >
      <div className="note-box-header" onMouseDown={onDragStart}>
        <div className="drag-handle">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="8" cy="4" r="2" />
            <circle cx="8" cy="12" r="2" />
            <circle cx="8" cy="20" r="2" />
            <circle cx="16" cy="4" r="2" />
            <circle cx="16" cy="12" r="2" />
            <circle cx="16" cy="20" r="2" />
          </svg>
        </div>
        <input
          type="text"
          className="note-box-title"
          value={note.title}
          onChange={(e) => onUpdateTitle(e.target.value)}
          onMouseDown={(e) => e.stopPropagation()}
        />
        <button
          className="note-box-delete"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
        >
          ×
        </button>
      </div>
      <div
        className="note-box-content"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <Editor
          key={note.id}
          initialContent={note.content}
          onChange={onUpdateContent}
          onMetricsChange={() => {}}
        />
      </div>
      <div className="resize-handle" onMouseDown={onResizeStart} />
    </div>
  )
}
