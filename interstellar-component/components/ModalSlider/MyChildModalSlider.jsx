import React from "react";

const MyChildModalSlider = ({ open = false, width, element }) => {
  return (
    <>
      {element && (
        <div
          style={{ width: open ? `${width}px` : "0px" }}
          className={`duration-500 ease-out overflow-hidden`}
        >
          <div className="border-r border-gray-light/200">
            {open && element}
          </div>
        </div>
      )}
    </>
  );
};

export default MyChildModalSlider;
