import React from 'react'

const defaultOnClick = () => {}

function MyChip({
  label,
  color,
  variant,
  size,
  rounded = 'full',
  dot = false,
  startAdornment,
  endAdornment,
  onClick = defaultOnClick,
  customStyle,
  customDotColor,
  disabled = false,
  capitalize = false,
}) {
  const makeStyle = React.useMemo(() => {
    let className = 'w-max h-max flex items-center'

    if (color === 'gray' && variant === 'filled') {
      className +=
        ' text-gray-light/700 border border-gray-light/200 bg-gray-light/50'
    } else if (color === 'gray' && variant === 'outlined') {
      className += ' text-gray-light/700 border border-gray-light/600 bg-white '
    } else if (color === 'gray' && variant === 'modern') {
      className += ' text-gray-light/700 border border-gray-light/300 bg-white'
    } else if (color === 'primary' && variant === 'filled') {
      className += ' text-brand/700 border border-brand/200 bg-brand/50'
    } else if (color === 'primary' && variant === 'outlined') {
      className += ' text-brand/700 border border-brand/900 bg-white'
    } else if (color === 'primary' && variant === 'modern') {
      className += ' text-gray-light/700 border border-gray-light/300 bg-white'
    } else if (color === 'error' && variant === 'filled') {
      className += ' text-error/700 border border-error/200 bg-error/50'
    } else if (color === 'error' && variant === 'outlined') {
      className += ' text-error/700 border border-error/600 bg-white'
    } else if (color === 'error' && variant === 'modern') {
      className += ' text-gray-light/700 border border-gray-light/300 bg-white'
    } else if (color === 'warning' && variant === 'filled') {
      className += ' text-warning/700 border border-warning/200 bg-warning/50'
    } else if (color === 'warning' && variant === 'outlined') {
      className += ' text-warning/700 border border-warning/600 bg-white'
    } else if (color === 'warning' && variant === 'modern') {
      className += ' text-gray-light/700 border border-gray-light/300 bg-white'
    } else if (color === 'success' && variant === 'filled') {
      className += ' text-success/700 border border-success/200 bg-success/50'
    } else if (color === 'success' && variant === 'outlined') {
      className += ' text-success/700 border border-success/600 bg-white'
    } else if (color === 'success' && variant === 'modern') {
      className += ' text-gray-light/700 border border-gray-light/300 bg-white'
    } else if (color === 'indigo' && variant === 'filled') {
      className += ' text-indigo/700 border border-indigo/200 bg-indigo/50'
    } else if (color === 'indigo' && variant === 'outlined') {
      className += ' text-indigo/700 border border-indigo/600 bg-white'
    } else if (color === 'indigo' && variant === 'modern') {
      className += ' text-gray-light/700 border border-gray-light/300 bg-white'
    } else if (color === 'blue' && variant === 'filled') {
      className += ' text-blue/700 border border-blue/200 bg-blue/50'
    } else if (color === 'blue' && variant === 'outlined') {
      className += ' text-blue/700 border border-blue/600 bg-white'
    } else if (color === 'blue' && variant === 'modern') {
      className += ' text-gray-light/700 border border-gray-light/300 bg-white'
    } else if (color === 'modern' && variant === 'filled') {
      className +=
        ' text-gray-light/700 border border-gray-light/200 bg-white shadow-shadows/shadow-xs'
    } else if (color === 'modern' && variant === 'outlined') {
      className +=
        ' text-gray-light/700 border border-gray-light/300 bg-white shadow-shadows/shadow-xs'
    } else if (color === 'pink' && variant === 'outlined') {
      className +=
        ' text-pink/700 border border-pink/300 bg-pink/50 shadow-shadows/shadow-xs'
    }

    if (size === 'sm') {
      if (dot) className += ' py-0.5 pl-1.5 pr-2'
      else if (startAdornment && endAdornment) className += ' py-0.5 px-1.5'
      else if (startAdornment) className += ' py-0.5 pl-1.5 pr-2'
      else if (endAdornment) className += ' py-0.5 pl-2 pr-1.5'
      else className += ' py-0.5 px-2'

      className += ' text-xs-medium gap-x-1'
    } else if (size === 'md') {
      if (dot) className += ' py-0.5 pl-2 pr-2.5'
      else if (startAdornment && endAdornment) className += ' py-0.5 px-1.5'
      else if (startAdornment) className += ' py-0.5 pl-1.5 pr-2.5'
      else if (endAdornment) className += ' py-0.5 pl-2.5 pr-1.5'
      else className += ' py-0.5 px-2.5'

      className += ' text-sm-medium gap-x-1.5'
    } else if (size === 'lg') {
      if (dot) className += ' py-1 pl-2.5 pr-3'
      else if (startAdornment && endAdornment) className += ' py-1 px-1.5'
      else if (startAdornment) className += ' py-1 pl-1.5 pr-3'
      else if (endAdornment) className += ' py-1 pl-3 pr-1.5'
      else className += ' py-1 px-3'

      className += ' text-sm-medium gap-x-1.5'
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

    // if (onClick !== defaultOnClick) {
    //   className += ' cursor-pointer'
    // }
    if (disabled) {
      className += ' cursor-default'
    } else if (onClick !== defaultOnClick) {
      className += ' cursor-pointer'
    }

    if (customStyle) {
      className += ` ${customStyle}`
    }

    return className
  }, [
    color,
    variant,
    size,
    rounded,
    onClick,
    customStyle,
    dot,
    startAdornment,
    endAdornment,
  ])

  const getDotClass = React.useMemo(() => {
    if (customDotColor) {
      return `bg-${customDotColor}`
    }
    let className = ''
    if (color === 'gray') {
      className += 'bg-gray-light/500'
    } else if (color === 'primary') {
      className += 'bg-brand/500'
    } else if (color === 'error') {
      className += 'bg-error/500'
    } else if (color === 'warning') {
      className += 'bg-warning/500'
    } else if (color === 'success') {
      className += 'bg-success/500'
    }

    return className
  }, [color, customDotColor])

  return (
    <div className={makeStyle} onClick={disabled ? undefined : onClick}>
      {dot && (
        <div
          className={`h-[6px] min-h-[6px] w-[6px] min-w-[6px] rounded-full ${getDotClass}`}
        ></div>
      )}
      {startAdornment && startAdornment}
      {capitalize ? label.charAt(0).toUpperCase() + label.slice(1) : label}
      {endAdornment && endAdornment}
    </div>
  )
}

export default MyChip
