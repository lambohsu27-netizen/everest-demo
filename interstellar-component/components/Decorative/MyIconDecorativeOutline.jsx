import React from 'react'

function MyIconDecorativeOutline({ children, color }) {
  const makeStyleIcon = React.useMemo(() => {
    let className = ''
    if (color === 'gray') {
      className += 'text-gray-light/600'
    } else if (color === 'primary') {
      className += 'text-brand/900'
    } else if (color === 'success') {
      className += 'text-success/600'
    } else if (color === 'warning') {
      className += 'text-warning/600'
    } else if (color === 'error') {
      className += 'text-error/600'
    }

    return className
  }, [color])

  const makeStyleBorder = React.useMemo(() => {
    let className = ''
    if (color === 'gray') {
      className +=
        '[&>*:nth-child(1)]:border-gray-light/600/30 [&>*:nth-child(2)]:border-gray-light/600/10'
    } else if (color === 'primary') {
      className +=
        '[&>*:nth-child(1)]:border-brand/900/30 [&>*:nth-child(2)]:border-brand/900/10'
    } else if (color === 'success') {
      className +=
        '[&>*:nth-child(1)]:border-success/600/30 [&>*:nth-child(2)]:border-success/600/10'
    } else if (color === 'warning') {
      className +=
        '[&>*:nth-child(1)]:border-warning/600/30 [&>*:nth-child(2)]:border-warning/600/10'
    } else if (color === 'error') {
      className +=
        '[&>*:nth-child(1)]:border-error/600/30 [&>*:nth-child(2)]:border-error/600/10'
    }

    return className
  }, [color])

  return (
    <>
      {children && (
        <div className="relative flex w-max items-center justify-center">
          <div className={`${makeStyleIcon}`}>{children}</div>
          <div
            className={`absolute flex h-[38px] w-[38px] items-center justify-center ${makeStyleBorder}`}
          >
            <span className="absolute block h-7 w-7 rounded-full border-2" />
            <span className="absolute block h-[38px] w-[38px] rounded-full border-2" />
          </div>
        </div>
      )}
    </>
  )
}

export default MyIconDecorativeOutline
