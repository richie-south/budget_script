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

const STORAGE_KEY = "budget-script-notes"

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (e) {
      console.error("Failed to load notes:", e)
    }
    return []
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
    } catch (e) {
      console.error("Failed to save notes:", e)
    }
  }, [notes])

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
    setNotes((prev) => [newNote, ...prev])
    return newNote
  }

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id
          ? { ...note, ...updates, updatedAt: new Date().toISOString() }
          : note
      )
    )
  }

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id))
  }

  return {
    notes,
    createNote,
    updateNote,
    deleteNote,
  }
}
