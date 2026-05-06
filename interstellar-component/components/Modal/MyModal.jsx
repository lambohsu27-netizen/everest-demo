import React, { useEffect } from 'react'
import Modal from '@mui/material/Modal'
import $ from 'jquery'
import { useApp } from '../../../src/AppContext'

function MyModal({ children, maxWidth, open = false, onClose = null, forceBlur = false, zIndex }) {
  const { user } = useApp()
  const handleClose = function (e) {
    if (!$(e.target).closest('#my-modal-children').length) {
      if (onClose) onClose()
    }
  }

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        $('.my-modal-btn-close').on('click', (e) => {
          $('.my-modal-btn-close').off('click')
          if (onClose) onClose()
        })
      }, 200)
    }
  }, [])

  return (
    <Modal
      open={open}
      onClose={null}
      sx={{
        zIndex: zIndex || 1300,
        '&.MuiModal-root .MuiBackdrop-root': {
          backgroundColor: 'transparent',
          opacity: '1 !important',
        },
      }}
    >
      <div
        onClick={handleClose}
        style={{
          backgroundColor: 'rgba(12, 17, 29, 0.7)',
          backdropFilter: `${user?.general?.settings?.blur_display?.modals || forceBlur ? ' blur(4px)' : ''}`,
        }}
        className="relative flex h-full w-full items-center justify-center"
      >
        <div
          id="my-modal-children"
          style={{
            maxWidth: maxWidth && maxWidth !== 0 ? `${maxWidth}px` : '',
          }}
          className={`${maxWidth && maxWidth !== 0 ? 'w-full' : ''}`}
        >
          {children}
        </div>
      </div>
    </Modal>
  )
}

export default MyModal
