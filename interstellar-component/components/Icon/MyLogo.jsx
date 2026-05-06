import React from 'react'
import { MySkeuomorphicContainer } from '@interstellar-component'
import Logomark from './Logomark.svg'

/**
 * MyLogo component based on Figma design.
 *
 * @param {Object} props
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Additional inline styles
 * @param {boolean} props.showText - Whether to show the "EVEREST" text (default: false)
 * @param {boolean} props.width
 * @param {boolean} props.height
 * @returns {JSX.Element}
 */
function MyLogo({ className = '', style = {}, showText = false, darkMode = false, height, width }) {
  // Use provided height/width or default to 32px (consistent with previous wrapper height)
  const h = height || 32
  const w = width || h

  // Design proportions:
  // Base design reference: Container height = 48px, Icon size = 32px, Padding = 8px, Radius = 12px.
  // This matches a 2/3 ratio for the icon relative to the container.
  // We use h/48 as the scale factor to achieve the target container height.
  const scale = h / 48

  const iconSize = 32 * scale
  const padding = 8 * scale
  const borderRadius = 12 * scale

  // Text scaling (relative to 32px reference height where fontSize is 21px)
  const textScale = h / 32
  const fontSize = 21 * textScale
  const lineHeight = 22 * textScale
  const gap = 8 * textScale

  return (
    <div
      className={`flex items-center ${className}`}
      style={{
        gap: `${gap}px`,
        width: showText ? 'max-content' : `${w}px`,
        height: `${h}px`,
        ...style,
      }}
    >
      <MySkeuomorphicContainer
        style={{
          width: `${w}px`,
          height: `${h}px`,
          padding: `${padding}px`,
          borderRadius: `${borderRadius}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <div
          className="flex items-center justify-center shrink-0"
          style={{ width: `${iconSize}px`, height: `${iconSize}px` }}
        >
          <img
            src={Logomark}
            alt="Everest Logomark"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>
      </MySkeuomorphicContainer>
      {showText && (
        <span
          className={`${darkMode ? 'text-white' : 'text-brand/800'} font-semibold`}
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: `${lineHeight}px`,
            fontFamily: "'SF Pro Display', 'SF Pro', 'Inter', sans-serif",
            letterSpacing: '0',
            whiteSpace: 'nowrap',
          }}
        >
          EVEREST
        </span>
      )}
    </div>
  )
}

export default MyLogo
