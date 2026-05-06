import React from 'react'
import MyIcon from './MyIcon'

/**
 * MyFeaturedIconV2 component based on Figma design.
 * Features a double-circle design with a solid inner container and light outer container.
 *
 * @param {Object} props
 * @param {string} props.icon - Icon name from untitled-ui-icons
 * @param {string} [props.color='Brand'] - Color variant (Brand, Gray, Success, Error, Warning)
 * @param {string} [props.size='sm'] - Size variant (sm, md, lg)
 * @param {string} [props.className=''] - Additional CSS classes
 * @returns {JSX.Element}
 */
function MyFeaturedIconV2({ icon = 'Home03', color = 'Brand', size = 'sm', className = '' }) {
  // Size mapping
  const sizeStyles = {
    lg: { outer: 'w-12 h-12', inner: 'w-9 h-9', icon: 16 },
    md: { outer: 'w-10 h-10', inner: 'w-7.5 h-7.5', icon: 12 },
    sm: { outer: 'w-8 h-8', inner: 'w-6 h-6', icon: 8 },
  }

  const currentSize = sizeStyles[size] || sizeStyles.sm

  // Color mapping for outer and inner layers
  const colorStyles = {
    Brand: {
      outerBg: 'bg-brand/50',
      outerBorder: 'border-brand/200',
      innerBg: 'bg-brand/900',
    },
    Gray: {
      outerBg: 'bg-gray/50',
      outerBorder: 'border-gray/200',
      innerBg: 'bg-gray/600',
    },
    Success: {
      outerBg: 'bg-success/50',
      outerBorder: 'border-success/200',
      innerBg: 'bg-success/600',
    },
    Error: {
      outerBg: 'bg-error/50',
      outerBorder: 'border-error/200',
      innerBg: 'bg-error/600',
    },
    Warning: {
      outerBg: 'bg-warning/50',
      outerBorder: 'border-warning/200',
      innerBg: 'bg-warning/600',
    },
    Blue: {
      outerBg: 'bg-blue/50',
      outerBorder: 'border-blue/200',
      innerBg: 'bg-blue/600',
    },
    Orange: {
      outerBg: 'bg-orange-50',
      outerBorder: 'border-orange-200',
      innerBg: 'bg-orange-600',
    },
  }

  const currentColors = colorStyles[color] || colorStyles.Brand

  return (
    <div
      className={`
        flex items-center justify-center
        rounded-full border
        ${currentSize.outer}
        ${currentColors.outerBg}
        ${currentColors.outerBorder}
        relative overflow-hidden
        ${className}
      `}
    >
      {/* Gradient mask shine */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />

      <div
        className={`
          z-10 flex items-center justify-center
          rounded-full p-1
          ${currentSize.inner}
          ${currentColors.innerBg}
        `}
      >
        <MyIcon name={icon} size={currentSize.icon} className="text-white" />
      </div>
    </div>
  )
}

export default MyFeaturedIconV2
