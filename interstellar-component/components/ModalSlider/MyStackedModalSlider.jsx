import React, { useEffect, useState, useRef, useMemo } from 'react'
import ReactDOM from 'react-dom'
import { useApp } from '../../../src/AppContext'

/**
 * Module-level counter tracking how many MyStackedModalSlider instances currently own
 * the scrim. Only the instance that bumps the count from 0 → 1 renders it.
 */
let scrimOwnerCount = 0

function MyStackedModalSlider({ 
  children, 
  open = false, 
  onClose, 
  element, 
  scrim = false, 
  offset = 0, 
  width = 420,
  zIndex = 900,
  direction = 'right'
}) {
  const { user } = useApp()

  const [isMounting, setIsMounting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  /** Tracks whether THIS instance is responsible for rendering the scrim. */
  const isScrimOwnerRef = useRef(false)
  const [isScrimOwner, setIsScrimOwner] = useState(false)

  const makeStyleBackDrop = useMemo(() => {
    let className = 'w-full h-full z-[800] duration-500 cursor-default'
    if (open && isMounting && user?.general?.settings?.blur_display?.slideout_menus) {
      className += ' backdrop-blur-lg'
    }
    return className
  }, [open, isMounting, user?.general?.settings?.blur_display?.slideout_menus])

  const makeStyleContent = useMemo(() => {
    const style = { 
      width: `${width}px`,
      right: `${offset}px`
    }

    if (direction === 'bottom') {
      style.top = 'auto'
      if (isOpen && isMounting) {
        style.bottom = '0px'
      } else {
        style.bottom = '-100%'
      }
    } else {
      style.top = '0px'
      if (isOpen && isMounting) {
        style.right = `${offset}px`
      } else {
        style.right = '-100%'
      }
    }
    return style
  }, [isOpen, isMounting, offset, width, direction])

  const scrimOpacity = isOpen && isMounting ? 1 : 0

  // ── Open / close lifecycle ─────────────────────────────────────────────────
  useEffect(() => {
    if (open) {
      setIsMounting(true)
    } else if (isMounting) {
      setIsOpen(false)
      setTimeout(() => setIsMounting(false), 500)
    }
  }, [open, isMounting])

  useEffect(() => {
    if (isMounting) {
      setIsOpen(true)
    }
  }, [isMounting])

  // ── Scrim ownership ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!scrim) return

    if (isMounting) {
      if (scrimOwnerCount === 0) {
        isScrimOwnerRef.current = true
        setIsScrimOwner(true)
      }
      scrimOwnerCount += 1
    } else if (isScrimOwnerRef.current) {
      scrimOwnerCount = Math.max(0, scrimOwnerCount - 1)
      isScrimOwnerRef.current = false
      setIsScrimOwner(false)
    }
  }, [isMounting, scrim])

  // Safety: release on unmount
  useEffect(
    () => () => {
      if (isScrimOwnerRef.current) {
        scrimOwnerCount = Math.max(0, scrimOwnerCount - 1)
        isScrimOwnerRef.current = false
      }
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
              transition: 'opacity 500ms ease-out',
              pointerEvents: isOpen ? 'auto' : 'none',
              zIndex: 799, // Fixed low value so it stays below ALL stacked sliders
            }}
            className="fixed inset-0 bg-gray-950/40"
            aria-hidden="true"
          />,
          document.body
        )}

      {/* ── Slider panel ─────────────────────────────────────────────────── */}
      {ReactDOM.createPortal(
        isMounting && (
          <div className="flex">
            <div 
              style={{ zIndex }} 
              className="fixed left-0 top-0 h-full w-full pointer-events-none"
            >
              <div className="relative flex h-full w-full overflow-hidden pointer-events-none">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => onClose?.()}
                  onKeyDown={handleBackdropKeyDown}
                  className={`${makeStyleBackDrop} pointer-events-auto`}
                />
                <div
                  style={{ ...makeStyleContent, zIndex: zIndex + 1 }}
                  className="absolute h-screen border-l border-gray-light/200 bg-white shadow-shadows/shadow-xl duration-500 ease-out pointer-events-auto"
                >
                  <div className="relative flex h-screen justify-end">
                    {/* Render element (child/nested) before children (parent) for left-to-right stacking */}
                    <div>{open ? element : null}</div>
                    {children}
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

export default MyStackedModalSlider
