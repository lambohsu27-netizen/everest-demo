import React from 'react'
import { Loading01 } from '@untitled-ui/icons-react'
import MyBgPatternDecorativeCircle from '../Decorative/MyBgPatternDecorativeCircle'

const MyLoadingData = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-4">
        <MyBgPatternDecorativeCircle>
          <div className="flex h-12 w-12 items-center justify-center rounded-[10px] border border-gray-light/200">
            <Loading01
              className={'animate-spin text-brand/900'}
              size={24}
              stroke={'currentColor'}
            />
          </div>
        </MyBgPatternDecorativeCircle>
        <div className="z-20">
          <p className="text-md-semibold text-gray-light/900">Loading data</p>
        </div>
      </div>
    </>
  )
}

export default MyLoadingData
