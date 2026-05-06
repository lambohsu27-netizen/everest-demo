import React from 'react'

const MyBgPatternDecorativeBox = ({
  children,
  originClass = 'items-center justify-center',
}) => {
  return (
    <div className={`relative flex w-max ${originClass} z-10`}>
      <div className="z-20">{children}</div>
      <div
        className={`bg-gradient-radial absolute flex h-[336px] w-[336px] items-center justify-center`}
      >
        <span className="absolute block h-24 w-24 -rotate-12 rounded-lg border border-gray-light/200"></span>
        <span className="absolute block h-36 w-36 -rotate-12 rounded-lg border border-gray-light/200/80"></span>
        <span className="absolute block h-48 w-48 -rotate-12 rounded-lg border border-gray-light/200/60"></span>
        <span className="absolute block h-60 w-60 -rotate-12 rounded-lg border border-gray-light/200/40"></span>
        <span className="absolute block h-72 w-72 -rotate-12 rounded-lg border border-gray-light/200/20"></span>
        <span className="absolute block h-[336px] w-[336px] -rotate-12 rounded-lg"></span>
      </div>
    </div>
  )
}

export default MyBgPatternDecorativeBox
