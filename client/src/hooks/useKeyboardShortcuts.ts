import { useEffect, useRef } from 'react'

type KeyboardShortcut = {
  key: string
  ctrlKey?: boolean
  metaKey?: boolean
  shiftKey?: boolean
  handler: () => void
  description?: string
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  const shortcutsRef = useRef(shortcuts)

  useEffect(() => {
    shortcutsRef.current = shortcuts
  }, [shortcuts])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of shortcutsRef.current) {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase()
        const ctrlMatch = shortcut.ctrlKey ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey
        const metaMatch = shortcut.metaKey !== undefined 
          ? (shortcut.metaKey ? event.metaKey : !event.metaKey)
          : true
        const shiftMatch = shortcut.shiftKey !== undefined
          ? event.shiftKey === shortcut.shiftKey
          : true

        if (keyMatch && ctrlMatch && metaMatch && shiftMatch) {
          event.preventDefault()
          shortcut.handler()
          break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])
}

