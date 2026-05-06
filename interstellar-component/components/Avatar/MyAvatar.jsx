import React, { useEffect, useRef, useState } from 'react'
import { User01 } from '@untitled-ui/icons-react'

function MyAvatar({
  photo,
  size = 40,
  iconSize = 24,
  showOnlineStatus = false,
}) {
  const [isPhotoError, setIsPhotoError] = useState(false)
  const ref = useRef()

  useEffect(() => {
    if (photo && ref && !isPhotoError) {
      const url = typeof photo === 'string' ? photo : URL.createObjectURL(photo)
      ref.current.src = url;
    }
  }, [ref, photo, isPhotoError])

  return (
    <div className="relative">
      <div
        style={{
          position: '',
          height: size,
          width: size,
          minHeight: size,
          minWidth: size,
        }}
        className="overflow-hidden rounded-full border border-[#00000014]"
      >
        {photo && !isPhotoError ? (
          <img
            ref={ref}
            className="h-full w-full object-cover"
            src={photo}
            alt=""
            onError={() => {
              setIsPhotoError(true)
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-light/100">
            <User01
              // size={iconSize}
              className={`size-${iconSize >= 96 ? '24' : '13'} text-gray-light/500`}
              stroke="currentColor"
            />
          </div>
        )}
        {showOnlineStatus && (
          <div className="absolute bottom-0 right-0 h-3 min-h-[12px] w-3 min-w-[12px] rounded-full border border-white bg-success/500" />
        )}
      </div>
    </div>
  )
}

export default MyAvatar
