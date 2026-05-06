import React from 'react'
import MyIcon from './MyIcon'

/**
 * MyFeaturedIcon component based on Figma design.
 *
 * @param {Object} props
 * @param {string} props.icon - Icon name from untitled-ui-icons
 * @param {string} [props.color='Brand'] - Color variant (Brand, Gray, etc.)
 * @param {string} [props.size='xl'] - Size variant (sm, md, lg, xl)
 * @param {string} [props.type='Modern'] - Type variant (Modern, Light, Outline, etc.)
 * @param {string} [props.className=''] - Additional CSS classes
 * @returns {JSX.Element}
 */
function MyFeaturedIcon({ icon = 'Mail01', color = 'Brand', size = 'xl', className = '' }) {
  // Size mapping
  const sizeStyles = {
    xl: { container: 'w-14 h-14', icon: 28, radius: 'rounded-xl' },
    lg: { container: 'w-12 h-12', icon: 24, radius: 'rounded-lg' },
    md: { container: 'w-10 h-10', icon: 20, radius: 'rounded-md' },
    sm: { container: 'w-8 h-8', icon: 16, radius: 'rounded-sm' },
  }

  const currentSize = sizeStyles[size] || sizeStyles.xl

  // Color mapping for icon
  const iconColorStyles = {
    Brand: 'text-brand/900',
    Gray: 'text-gray/700',
    Success: 'text-success/600',
    Error: 'text-error/600',
    Warning: 'text-warning/600',
  }

  const iconColor = iconColorStyles[color] || iconColorStyles.Gray

  return (
    <div
      className={`
        flex items-center justify-center
        bg-white border border-gray/200
        ${currentSize.container}
        ${currentSize.radius}
        relative overflow-hidden
        ${className}
      `}
      style={{
        boxShadow: `
          0px 1px 2px 0px rgba(16, 24, 40, 0.05),
          inset 0px -2px 0px 0px rgba(10, 13, 18, 0.05),
          inset 0px 0px 0px 1px rgba(10, 13, 18, 0.18)
        `,
      }}
    >
      <div className="z-10">
        <MyIcon name={icon} size={currentSize.icon} className={iconColor} />
      </div>
    </div>
  )
}

export default MyFeaturedIcon
