import React from 'react'
import PropTypes from 'prop-types'
import { MyChip } from '@interstellar-component'

const statusConfig = {
  'Waiting CLIK approval': 'warning',
  'Document submission': 'gray',
  'Active': 'success',
  'Rejected': 'error',
}

/**
 * MyMemberStatusChip component for displaying member status in a styled chip.
 *
 * @param {object} props - Component props.
 * @param {string} props.status - The member status string.
 * @returns {JSX.Element} The rendered chip component.
 */
export default function MyMemberStatusChip({ status }) {
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

MyMemberStatusChip.propTypes = {
  status: PropTypes.string.isRequired,
}
