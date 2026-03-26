import React from 'react'
import PropTypes from 'prop-types'
import { MyChip } from '@interstellar-component'

const statusConfig = {
  New: 'primary',
  Pending: 'warning',
  Expired: 'error',
  Active: 'success',
}

export default function MyConsentStatusChip({ status }) {
  return (
    <MyChip
      label={status}
      color={statusConfig[status] || 'gray'}
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
