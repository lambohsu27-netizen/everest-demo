import React, { useEffect, useRef, useState } from 'react'
import { Bank } from '@untitled-ui/icons-react'

const MyBank = ({ photo, size = 64, iconSize = 32 }) => {
  const [isPhotoError, setIsPhotoError] = useState(false)
  const ref = useRef()
  useEffect(() => {
    if (photo && ref && !isPhotoError) {
      var url = typeof photo == 'string' ? photo : URL.createObjectURL(photo)
      ref.current.src = url
    }
  }, [ref, photo, isPhotoError])

  return (
    <>
      {photo && !isPhotoError ? (
        <div
          style={{ height: size, width: size, minHeight: size, minWidth: size }}
          className="overflow-hidden rounded-full border border-[#00000014]"
        >
          <img
            ref={ref}
            className="h-full w-full object-cover"
            src={photo}
            alt=""
            onError={() => {
              setIsPhotoError(true)
            }}
          />
        </div>
      ) : (
        <div
          style={{ height: size, width: size, minHeight: size, minWidth: size }}
          className="flex items-center justify-center overflow-hidden rounded-full border border-[#00000014] bg-gray-light/100"
        >
          <Bank
            size={iconSize}
            className={'text-gray-light/500'}
            stroke="currentColor"
          />
        </div>
      )}
    </>
  )
}

export default MyBank
