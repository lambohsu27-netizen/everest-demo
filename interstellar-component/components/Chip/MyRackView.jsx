import React from 'react'
import { Package } from '@untitled-ui/icons-react'

function MyRackView({
  label,
  size = 'sm',
  rounded = 'full',
  dot = false,
  startAdornment,
  endAdornment,
}) {
  const makeStyle = () => {
    let className = `w-max h-max flex items-center border-2 border-gray/200 ${rounded} text-gray-light/700`

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

    return className
  }

  return (
    <div className={makeStyle()}>
      {startAdornment && startAdornment}
      {label}
      {endAdornment && endAdornment}
    </div>
  )
}

export default MyRackView
