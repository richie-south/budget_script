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

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsOpen((prev) => !prev)
  }

  return (
    <div className="collapsible-box" data-open={isOpen}>
      <span
        className="collapsible-toggle"
        onClick={toggle}
        onMouseDown={(e) => e.stopPropagation()}
        role="button"
        aria-expanded={isOpen}
      >
        <svg
          className={`collapsible-icon ${isOpen ? "open" : ""}`}
          width="10"
          height="10"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 4L10 8L6 12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="collapsible-label">{title}</span>
      </span>
      <div className="collapsible-content-wrapper">
        <div className="collapsible-content">{children}</div>
      </div>
    </div>
  )
}
