import React from 'react'
import PropTypes from 'prop-types'
import MyChip from './MyChip'

const statusConfig = {
  new: { color: 'primary', label: 'New' },
  pending: { color: 'warning', label: 'Pending' },
  expired: { color: 'error', label: 'Expired' },
  active: { color: 'success', label: 'Active' },
  revoked: { color: 'error', label: 'Revoked' },
}

export default function MyConsentStatusChip({ status }) {
  const key = typeof status === 'string' ? status.toLowerCase() : ''
  const cfg = statusConfig[key]
  return (
    <MyChip
      label={cfg?.label ?? status ?? '—'}
      color={cfg?.color ?? 'gray'}
      variant="modern"
      size="sm"
      rounded="lg"
      dot
    />
  )
}

MyConsentStatusChip.propTypes = {
  status: PropTypes.string.isRequired,
}
