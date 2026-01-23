import { useState, useEffect, ReactNode } from "react"

interface CollapsibleBoxProps {
  id: string
  title: string
  children: ReactNode
  defaultOpen?: boolean
}

const STORAGE_KEY_PREFIX = "annotation-collapsed-"

export function CollapsibleBox({
  id,
  title,
  children,
  defaultOpen = true,
}: CollapsibleBoxProps) {
  const storageKey = `${STORAGE_KEY_PREFIX}${id}`

  const [isOpen, setIsOpen] = useState(() => {
    const stored = localStorage.getItem(storageKey)
    if (stored !== null) {
      return stored === "true"
    }
    return defaultOpen
  })

  useEffect(() => {
    localStorage.setItem(storageKey, String(isOpen))
  }, [isOpen, storageKey])

  const toggle = () => setIsOpen((prev) => !prev)

  return (
    <div className="collapsible-box">
      <button
        className="collapsible-header"
        onClick={toggle}
        aria-expanded={isOpen}
      >
        <span className="collapsible-title">{title}</span>
        <svg
          className={`collapsible-icon ${isOpen ? "open" : ""}`}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {isOpen ? (
        <div className="collapsible-content">{children}</div>
      ) : (
        <div className="collapsible-folded">
          <div className="folded-line" />
        </div>
      )}
    </div>
  )
}
