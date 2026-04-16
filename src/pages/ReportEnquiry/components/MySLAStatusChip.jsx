import React from 'react'
import PropTypes from 'prop-types'
import { MyChip } from '@interstellar-component'

const statusConfig = {
  'Sent to CLIK': 'primary',
  'Awaiting Form': 'warning',
  'Form Revision': 'warning',
  Verification: 'primary',
  'Admin verification': 'primary',
  'Awaiting Admin Approval': 'primary',
  'Awaiting Consent': 'warning',
  Canceled: 'error',
  Failed: 'error',
  Completed: 'success',
}

/**
 * MySLAStatusChip component for displaying SLA status in a styled chip.
 *
 * @param {object} props - Component props.
 * @param {string} props.status - The SLA status string.
 * @returns {JSX.Element} The rendered chip component.
 */
export default function MySLAStatusChip({ status }) {
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

MySLAStatusChip.propTypes = {
  status: PropTypes.string.isRequired,
}
