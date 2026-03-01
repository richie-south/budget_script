import { useState, useEffect } from "react"

export interface Note {
  id: string
  title: string
  content: string
  x: number
  y: number
  width: number
  height: number
  createdAt: string
  updatedAt: string
}

export interface Canvas {
  id: string
  name: string
  notes: Note[]
  createdAt: string
  updatedAt: string
}

const STORAGE_KEY = "budget-script-canvases"

export function useCanvases() {
  const [canvases, setCanvases] = useState<Canvas[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored)
      }
      
      // Migration: Check for old notes
      const oldNotes = localStorage.getItem("budget-script-notes")
      if (oldNotes) {
        const notes = JSON.parse(oldNotes)
        if (notes.length > 0) {
          return [{
            id: Date.now().toString(),
            name: "My Canvas",
            notes,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }]
        }
      }
    } catch (e) {
      console.error("Failed to load canvases:", e)
    }
    
    // Default initial state
    return [{
      id: Date.now().toString(),
      name: "Canvas 1",
      notes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }]
  })

  const [activeCanvasId, setActiveCanvasId] = useState<string>(() => {
    if (canvases.length > 0) return canvases[0].id
    return ""
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(canvases))
    } catch (e) {
      console.error("Failed to save canvases:", e)
    }
  }, [canvases])

  const activeCanvas = canvases.find(c => c.id === activeCanvasId) || canvases[0]

  const createCanvas = () => {
    const newCanvas: Canvas = {
      id: Date.now().toString(),
      name: `Canvas ${canvases.length + 1}`,
      notes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setCanvases(prev => [...prev, newCanvas])
    setActiveCanvasId(newCanvas.id)
    return newCanvas
  }

  const deleteCanvas = (id: string) => {
    if (canvases.length <= 1) return
    
    setCanvases(prev => {
      const newCanvases = prev.filter(c => c.id !== id)
      if (activeCanvasId === id) {
        setActiveCanvasId(newCanvases[0].id)
      }
      return newCanvases
    })
  }

  const updateCanvasName = (id: string, name: string) => {
    setCanvases(prev => prev.map(c => c.id === id ? { ...c, name } : c))
  }

  // Note operations for active canvas
  const createNote = (initialPosition?: { x: number; y: number; width: number; height: number }) => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "Untitled Note",
      content: "",
      x: initialPosition?.x ?? 100,
      y: initialPosition?.y ?? 100,
      width: initialPosition?.width ?? 300,
      height: initialPosition?.height ?? 200,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setCanvases(prev => prev.map(c => {
      if (c.id === activeCanvasId) {
        return {
          ...c,
          notes: [newNote, ...c.notes],
          updatedAt: new Date().toISOString()
        }
      }
      return c
    }))
    
    return newNote
  }

  const updateNote = (noteId: string, updates: Partial<Note>) => {
    setCanvases(prev => prev.map(c => {
      if (c.id === activeCanvasId) {
        return {
          ...c,
          notes: c.notes.map(n => n.id === noteId ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n),
          updatedAt: new Date().toISOString()
        }
      }
      return c
    }))
  }

  const deleteNote = (noteId: string) => {
    setCanvases(prev => prev.map(c => {
      if (c.id === activeCanvasId) {
        return {
          ...c,
          notes: c.notes.filter(n => n.id !== noteId),
          updatedAt: new Date().toISOString()
        }
      }
      return c
    }))
  }

  return {
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
  }
}
