import React, { useState } from 'react'
import { Minus, ZoomIn, PlusCircle } from '@untitled-ui/icons-react'
import Modal from '@mui/material/Modal'
import { MyButtonGroupV2 } from '@interstellar-component'

const MyDetailImageLocal = ({
  imageUrl,
  thumbnailClassName = 'max-w-full h-auto cursor-pointer',
}) => {
  const [open, setOpen] = useState(false)
  const [zoom, setZoom] = useState(1)

  const handleOpen = () => {
    setZoom(1)
    setOpen(true)
  }
  const handleClose = () => setOpen(false)

  const handleZoomAction = (action) => {
    if (action === 'zoom') setZoom((z) => z + 0.1)
    else if (action === 'minus')
      setZoom((z) => Math.max(z - 0.1, 0.1))
    else if (action === 'plus') setZoom(1)
  }

  return (
    <>
      <img
        src={imageUrl}
        alt="click to enlarge"
        className={thumbnailClassName}
        onClick={handleOpen}
      />

      <Modal
        open={open}
        onClose={handleClose}
        sx={{
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0,0,0,0.8)',
          },
        }}
      >
        <div
          className="flex h-full items-center justify-center p-4"
          onClick={handleClose}
        >
          <div
            className="relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={imageUrl}
              alt="preview"
              className="max-h-[80vh] max-w-[90vw] object-contain"
              style={{
                transform: `scale(${zoom})`,
                transition: 'transform 0.3s',
              }}
            />

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
              <MyButtonGroupV2
                buttons={[
                  { label: <Minus />, value: 'minus' },
                  { label: <ZoomIn />, value: 'zoom' },
                  { label: <PlusCircle />, value: 'plus' },
                ]}
                value={'page'}
                onChange={(value) => handleZoomAction(value)}
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default MyDetailImageLocal
