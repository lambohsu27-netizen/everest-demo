import React from 'react'
import SimpleBar from 'simplebar-react'

function MyHorizontalTab({
  children,
  value,
  selectedIsMatchPath,
  onChange,
  type,
  fullwidth,
}) {
  const makeStyle = React.useMemo(() => {
    let className = ''

    if (type === 'underline') {
      className += ' border-b border-gray-light/200 gap-3'
    } else if (type === 'button-white-border') {
      className +=
        ' border border-gray-light/200 bg-gray-light/50 rounded-[10px] p-1 gap-1'
    } else if (type === 'button-primary-border') {
      className += 'border-b border-gray-light/200 p-1 gap-3'
    }

    return className
  }, [type])
  return (
    <SimpleBar forceVisible="x" style={{ maxWidth: '100%' }}>
      <div className={`flex w-full items-center ${makeStyle}`}>
        {children &&
          React.Children.map(children, (child, index) =>
            React.cloneElement(child, {
              selected: value === child?.props?.value,
              onChange,
              type,
              selectedIsMatchPath,
              fullwidth,
              key: index,
            })
          )}
      </div>
    </SimpleBar>
  )
}

export default MyHorizontalTab
