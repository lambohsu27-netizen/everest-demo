import React from 'react'

function MyButton({
  children,
  type = 'button',
  color,
  variant,
  size,
  rounded = 'lg',
  disabled = false,
  expanded = false,
  onClick,
  value,
  removeWhite = false,
  id = '',
  customClassname,
}) {
  const makeStyle = React.useMemo(() => {
    let className = `${
      expanded ? 'w-full' : 'w-max'
    } h-max flex items-center justify-center text-center text-sm-semibold `

    if (color === 'primary' && variant === 'text') {
      className += disabled
        ? 'text-gray-light/400 focus:outline-none'
        : 'text-brand/700 hover:text-brand/800 focus:outline-none'
    } else if (color === 'primary' && variant === 'link') {
      className += disabled
        ? 'text-brand/400 focus:outline-none'
        : 'text-brand/700 hover:text-brand/800 focus:outline-none'
    } else if (color === 'primary' && variant === 'outlined') {
      className += disabled
        ? 'text-gray-light/400 bg-white shadow-shadows/shadow-xs border border-gray-light/200 focus:outline-none'
        : 'text-brand/700 hover:text-brand/800 bg-white hover:bg-brand/50 shadow-shadows/shadow-xs border border-brand/300 focus:outline-none focus:ring focus:ring-offset-0 focus:ring-[#42307D3D]'
    } else if (color === 'primary' && variant === 'filled') {
      className += disabled
        ? 'text-gray-light/400 bg-gray-light/100 shadow-shadows/shadow-xs border border-gray-light/200 focus:outline-none'
        : 'text-white bg-brand/600 hover:bg-brand/700 shadow-shadows/shadow-xs focus:outline-none focus:ring focus:ring-offset-0 focus:ring-[#42307D3D]'
    } else if (color === 'primary' && variant === 'filledTonal') {
      className += disabled
        ? 'text-gray-light/400 focus:outline-none'
        : 'text-brand/700 hover:text-brand/800 bg-brand/50 focus:outline-none'
    } else if (color === 'secondary' && variant === 'text') {
      className += disabled
        ? 'text-gray-light/400 focus:outline-none'
        : 'text-gray-light/700 hover:text-gray-light/800 focus:outline-none'
    } else if (color === 'secondary' && variant === 'link') {
      className += disabled
        ? 'text-gray-light/400 focus:outline-none'
        : 'text-gray-light/700 hover:text-gray-light/800 focus:outline-none'
    } else if (color === 'secondary' && variant === 'outlined') {
      className += disabled
        ? 'text-gray-light/400 bg-white shadow-shadows/shadow-xs border border-gray-light/200 focus:outline-none'
        : 'text-gray-light/700 hover:text-gray-light/800 bg-white hover:bg-gray-light/50 shadow-shadows/shadow-xs border border-gray-gray-light/300 focus:outline-none focus:ring focus:ring-offset-0 focus:ring-[#98A2B324]'
    } else if (color === 'secondary' && variant === 'filled') {
      className += disabled
        ? 'text-gray-light/400 bg-gray-light/100 shadow-shadows/shadow-xs border border-gray-light/200 focus:outline-none'
        : 'text-white bg-gray-light/600 hover:bg-gray-light/700 shadow-shadows/shadow-xs focus:outline-none focus:ring focus:ring-offset-0 focus:ring-[#98A2B324]'
    } else if (color === 'secondary' && variant === 'filledTonal') {
      className += disabled
        ? 'text-gray-light/400 focus:outline-none'
        : 'text-gray-light/700 hover:text-gray-light/800 bg-gray-light/50 focus:outline-none'
    } else if (color === 'error' && variant === 'text') {
      className += disabled
        ? 'text-error/400 focus:outline-none'
        : 'text-error/700 hover:text-error/800 focus:outline-none'
    } else if (color === 'error' && variant === 'link') {
      className += disabled
        ? 'text-error/400 focus:outline-none'
        : 'text-error/700 hover:text-error/800 focus:outline-none'
    } else if (color === 'error' && variant === 'outlined') {
      className += disabled
        ? 'text-error/400 bg-white shadow-shadows/shadow-xs border border-error/200 focus:outline-none'
        : 'text-error/700 hover:text-error/800 bg-white hover:bg-error/50 shadow-shadows/shadow-xs border border-error/300 focus:outline-none focus:ring focus:ring-offset-0 focus:ring-[#98A2B324]'
    } else if (color === 'error' && variant === 'filled') {
      className += disabled
        ? 'text-error/400 bg-error/100 shadow-shadows/shadow-xs border border-error/200 focus:outline-none'
        : 'text-white bg-error/600 hover:bg-error/700 shadow-shadows/shadow-xs focus:outline-none focus:ring focus:ring-offset-0 focus:ring-[#98A2B324]'
    } else if (color === 'error' && variant === 'filledTonal') {
      className += disabled
        ? 'text-error/400 focus:outline-none'
        : 'text-error/700 hover:text-error/800 bg-error/50 focus:outline-none'
    } else if (color === 'white' && variant === 'text') {
      className += disabled
        ? 'text-white focus:outline-none'
        : 'text-white hover:text-gray-light/200 focus:outline-none'
    } else if (color === 'purple' && variant === 'outlined') {
      className += disabled
        ? 'text-brand/300 bg-white border border-brand/100 focus:outline-none'
        : 'text-brand/700 hover:text-brand/800 bg-white hover:bg-brand/50 border border-brand/300 focus:outline-none focus:ring focus:ring-offset-0 focus:ring-[#42307D3D]'
    }

    if (variant === 'link') {
      className += ' px-0 py-0'
    } else if (size === 'sm') {
      className += ' py-2 px-3 gap-x-1'
    } else if (size === 'md') {
      className += ' py-2.5 px-3.5 gap-x-1'
    } else if (size === 'lg') {
      className += ' py-2.5 px-4 gap-x-1.5'
    } else if (size === 'xl') {
      className += ' py-3 px-[18px] gap-x-1.5'
    } else if (size === '2xl') {
      className += ' py-4 px-[22px] gap-x-2.5'
    }

    if (rounded === 'none') {
      className += ' rounded-none'
    } else if (rounded === 'sm') {
      className += ' rounded-sm'
    } else if (rounded === 'md') {
      className += ' rounded-md'
    } else if (rounded === 'lg') {
      className += ' rounded-lg'
    } else if (rounded === 'xl') {
      className += ' rounded-xl'
    } else if (rounded === '2xl') {
      className += ' rounded-2xl'
    } else if (rounded === '3xl') {
      className += ' rounded-3xl'
    } else if (rounded === 'full') {
      className += ' rounded-full'
    }

    if (customClassname) {
      className += ` ${customClassname}`
    }

    if (disabled) {
      className += ' cursor-not-allowed'
    }
    if (removeWhite)
      className = className
        .replace(/bg-white/g, '')
        .replace(/hover:bg-gray-light/g, '')
    return className
  }, [color, variant, size, rounded, disabled, expanded, customClassname, removeWhite])

  return (
    <button
      value={value}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={makeStyle}
      id={id}
    >
      {children}
    </button>
  )
}

export default MyButton
