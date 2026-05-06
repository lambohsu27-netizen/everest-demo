import React from 'react'

function MyBgPatternDecorativeCube({ children }) {
  return (
    <div className="relative z-0 flex w-max items-center justify-center">
      <div className="z-0">{children}</div>
      <div
        className="absolute z-0 h-[768px] w-[768px]"
        style={{
          maskImage:
            'radial-gradient(circle, rgba(0,0,0,1) 0%, rgba(255,255,255,0) 50%)',
        }}
      >
        <div className="relative z-0 h-full w-full">
          <div className="absolute z-0 flex h-full w-full flex-col justify-between">
            <div className="w-full border border-gray-light/200" />
            <div className="w-full border border-gray-light/200" />
            <div className="w-full border border-gray-light/200" />
            <div className="w-full border border-gray-light/200" />
            <div className="w-full border border-gray-light/200" />
            <div className="w-full border border-gray-light/200" />
            <div className="w-full border border-gray-light/200" />
            <div className="w-full border border-gray-light/200" />
            <div className="w-full border border-gray-light/200" />
            <div className="w-full border border-gray-light/200" />
            <div className="w-full border border-gray-light/200" />
            <div className="w-full border border-gray-light/200" />
            <div className="w-full border border-gray-light/200" />
            <div className="w-full border border-gray-light/200" />
            <div className="w-full border border-gray-light/200" />
            <div className="w-full border border-gray-light/200" />
            <div className="w-full border border-gray-light/200" />
          </div>
          <div className="absolute z-0 flex h-full w-full rotate-90 flex-col justify-between">
            <div className="w-full border border-gray-light/200" />
            <div className="w-full border border-gray-light/200" />
            <div className="w-full border border-gray-light/200" />
            <div className="w-full border border-gray-light/200" />
            <div className="w-full border border-gray-light/200" />
            <div className="w-full border border-gray-light/200" />
            <div className="w-full border border-gray-light/200" />
            <div className="w-full border border-gray-light/200" />
            <div className="w-full border border-gray-light/200" />
            <div className="w-full border border-gray-light/200" />
            <div className="w-full border border-gray-light/200" />
            <div className="w-full border border-gray-light/200" />
            <div className="w-full border border-gray-light/200" />
            <div className="w-full border border-gray-light/200" />
            <div className="w-full border border-gray-light/200" />
            <div className="w-full border border-gray-light/200" />
            <div className="w-full border border-gray-light/200" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyBgPatternDecorativeCube
