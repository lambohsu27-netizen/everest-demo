import React from "react";

function MyStepper({ children, activeStep = 0 }) {
  const childrenCount = React.Children.count(children)
  return (
    <div className="flex flex-col">
      {children &&
        React.Children.map(children, (child, index) =>
          React.cloneElement(child, {
            key: index,
            active: activeStep === child?.props?.value,
            completed: child?.props?.value < activeStep,
            isLast: index === childrenCount - 1,
          })
        )}
    </div>
  )
}

export default MyStepper;