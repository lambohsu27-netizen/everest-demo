import React, { useEffect, useState, useRef, useMemo } from 'react'
import ReactDOM from 'react-dom'
import { useApp } from '../../../src/AppContext'
// import { useApp } from "../../AppContext";

/**
 * Global scrim registry. One instance owns the scrim DOM at a time; opacity is
 * driven by whether ANY instance is currently "open" so the scrim stays fully
 * dark when switching from one slider directly to another.
 */
const scrimRequesters = [] // ids with scrim && isMounting (controls ownership)
const scrimOpeners = new Set() // ids with scrim && isOpen (controls opacity)
const scrimSubscribers = new Map() // id -> (isOwner, anyOpen) => void

function notifyScrim() {
  const ownerId = scrimRequesters[0] ?? null
  const anyOpen = scrimOpeners.size > 0
  scrimSubscribers.forEach((fn, id) => fn(id === ownerId, anyOpen))
}

let nextScrimId = 0

function MyModalSlider({ children, open = false, onClose, element, scrim = false }) {
  const { user } = useApp()

  const [isMounting, setIsMounting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const scrimIdRef = useRef(null)
  if (scrimIdRef.current === null) scrimIdRef.current = ++nextScrimId
  const cancelRef = useRef(null)
  const [isScrimOwner, setIsScrimOwner] = useState(false)
  const [scrimAnyOpen, setScrimAnyOpen] = useState(false)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const makeStyleBackDrop = useMemo(() => {
    let className = 'w-full h-full z-[800] duration-300 cursor-default'
    if (open && isMounting && user?.general?.settings?.blur_display?.slideout_menus) {
      className += ' backdrop-blur-lg'
    }
    return className
  }, [open, isMounting, user?.general?.settings?.blur_display?.slideout_menus])

  const makeStyleContent = useMemo(() => {
    const style = {}
    if (isOpen && isMounting) {
      style.right = '0'
    } else if (!isOpen && isMounting) {
      style.right = '-100%'
    }
    return style
  }, [isOpen, isMounting])

  const scrimOpacity = scrimAnyOpen ? 1 : 0

  // ── Open / close lifecycle ─────────────────────────────────────────────────
  useEffect(() => {
    if (open) {
      setIsMounting(true)
    } else if (isMounting) {
      setIsOpen(false)
      setTimeout(() => setIsMounting(false), 300)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    if (isMounting) {
      const raf1 = requestAnimationFrame(() => {
        const raf2 = requestAnimationFrame(() => setIsOpen(true))
        cancelRef.current = raf2
      })
      cancelRef.current = raf1
      return () => {
        if (cancelRef.current) cancelAnimationFrame(cancelRef.current)
      }
    }
  }, [isMounting])

  // ── Scrim ownership + global open state ───────────────────────────────────
  useEffect(() => {
    if (!scrim) return undefined
    const id = scrimIdRef.current
    scrimSubscribers.set(id, (owner, anyOpen) => {
      setIsScrimOwner(owner)
      setScrimAnyOpen(anyOpen)
    })
    notifyScrim()
    return () => {
      scrimSubscribers.delete(id)
    }
  }, [scrim])

  useEffect(() => {
    if (!scrim) return
    const id = scrimIdRef.current
    if (isMounting) {
      if (!scrimRequesters.includes(id)) scrimRequesters.push(id)
    } else {
      const idx = scrimRequesters.indexOf(id)
      if (idx >= 0) scrimRequesters.splice(idx, 1)
    }
    notifyScrim()
  }, [isMounting, scrim])

  useEffect(() => {
    if (!scrim) return
    const id = scrimIdRef.current
    if (isOpen && isMounting) scrimOpeners.add(id)
    else scrimOpeners.delete(id)
    notifyScrim()
  }, [isOpen, isMounting, scrim])

  // Safety: release on unmount
  useEffect(
    () => () => {
      const id = scrimIdRef.current
      scrimSubscribers.delete(id)
      scrimOpeners.delete(id)
      const idx = scrimRequesters.indexOf(id)
      if (idx >= 0) scrimRequesters.splice(idx, 1)
      notifyScrim()
    },
    []
  )

  const handleBackdropKeyDown = (e) => {
    if (e.key === 'Escape') onClose?.()
  }

  return (
    <>
      {/* ── Scrim – only rendered by the owning instance ─────────────────── */}
      {scrim &&
        isScrimOwner &&
        isMounting &&
        ReactDOM.createPortal(
          <div
            style={{
              opacity: scrimOpacity,
              transition: 'opacity 300ms ease-out',
              pointerEvents: scrimAnyOpen ? 'auto' : 'none',
            }}
            className="fixed inset-0 z-[799] bg-gray-950/70"
            aria-hidden="true"
          />,
          document.body
        )}

      {/* ── Slider panel ─────────────────────────────────────────────────── */}
      {ReactDOM.createPortal(
        isMounting && (
          <div className="flex">
            <div className="fixed left-0 top-0 z-[800] h-full w-full">
              <div className="relative flex h-full w-full overflow-hidden">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => onClose?.()}
                  onKeyDown={handleBackdropKeyDown}
                  className={makeStyleBackDrop}
                />
                <div
                  style={makeStyleContent}
                  className="absolute top-0 z-[900] h-screen border-l border-gray-light/200 bg-white shadow-shadows/shadow-xl duration-300 ease-out"
                >
                  <div className="relative flex h-screen justify-end">
                    {children}
                    <div>{open ? element : null}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ),
        document.body
      )}
    </>
  )
}

export default MyModalSlider

