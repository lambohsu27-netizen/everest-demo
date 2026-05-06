import React from 'react'

/**
 * @typedef {Object} MySkeuomorphicContainerProps
 * @property {React.ReactNode} children
 * @property {string} [className]
 * @property {React.CSSProperties} [style]
 */

/**
 * A skeuomorphic container component based on Figma design.
 *
 * @param {MySkeuomorphicContainerProps} props
 */
function MySkeuomorphicContainer({ children, className = '', style = {} }) {
  const baseClasses = `
    inline-flex items-center justify-center p-2
    rounded-[12px] 
    bg-base-white bg-[linear-gradient(180deg,rgba(255,255,255,0.2)_0%,rgba(10,13,18,0.2)_100%)] 
    shadow-[0px_1px_2px_rgba(10,13,18,0.06),0px_1px_3px_rgba(10,13,18,0.1),0px_1px_1px_-0.5px_rgba(10,13,18,0.13),inset_0px_0px_0px_1px_rgba(10,13,18,0.12),inset_0px_-0.5px_0.5px_rgba(10,13,18,0.1)]
  `

  return (
    <div className={`${baseClasses} ${className}`} style={style}>
      {children}
    </div>
  )
}

export default MySkeuomorphicContainer
