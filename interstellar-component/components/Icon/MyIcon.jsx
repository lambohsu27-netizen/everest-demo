import { useMemo } from 'react'
import * as icons from '@untitled-ui/icons-react'

function MyIcon({ name = 'Edit01', size = 10, stroke, className }) {
  const Icon = icons[name]
  if (!Icon) {
    console.warn(`Icon "${name}" not found`)
    return null // or return a default icon
  }

  return <Icon className={className} size={size} stroke={stroke} />
}

export default MyIcon
