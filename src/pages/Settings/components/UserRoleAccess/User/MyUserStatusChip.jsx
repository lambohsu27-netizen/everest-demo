import React from 'react'
import PropTypes from 'prop-types'
import { MyChip } from '@interstellar-component'

export default function MyUserStatusChip({ status }) {
  return (
    <MyChip
      label={status ? 'Active' : 'Inactive'}
      color={status ? 'success' : 'gray'}
      variant="modern"
      size="sm"
      rounded="lg"
      dot
    />
  )
}

MyUserStatusChip.propTypes = {
  status: PropTypes.bool.isRequired,
}
