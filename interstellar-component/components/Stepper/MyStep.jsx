import React from 'react'

function MyStep({ children, stepIcon, active, completed, isLast = false }) {
  const isCurrent = active

  let iconStyles = ''
  if (completed) {
    iconStyles = 'bg-brand/900'
  } else if (isCurrent) {
    iconStyles = 'border-2 border-white ring-[4px] ring-brand/500'
  } else {
    iconStyles = 'border-2 border-brand/900'
  }

  const dotStyles = isCurrent ? 'bg-white' : 'bg-brand/900'
  const connectorStyles = 'bg-brand/900'

  return (
    <div className="flex items-start gap-4">
      <div className="flex flex-col items-center mt-0.5">
        <div
          className={`flex items-center justify-center rounded-full w-7 h-7 transition-all duration-300 ${iconStyles}`}
        >
          {completed ? (
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            stepIcon || (
              <div
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${dotStyles}`}
              />
            )
          )}
        </div>
        {!isLast && (
          <div
            className={`w-[2px] h-[3.25rem] my-2 rounded-full transition-colors duration-300 ${connectorStyles}`}
          />
        )}
      </div>
      <div
        className={`pb-6 transition-opacity duration-300 ${isCurrent || completed ? 'opacity-100' : 'opacity-60'}`}
      >
        {children}
      </div>
    </div>
  )
}

export default MyStep
