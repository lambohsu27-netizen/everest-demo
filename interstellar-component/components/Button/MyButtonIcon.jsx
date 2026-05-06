/* eslint-disable react/function-component-definition */
import React from "react";

const MyButtonIcon = ({
  children,
  type = "button",
  color,
  variant,
  size,
  rounded,
  disabled = false,
  onClick,
}) => {
  const makeStyle = React.useMemo(() => {
    let className = "w-max h-max flex items-center justify-center text-center ";
    if (color === "primary" && variant === "text") {
      className += disabled
        ? "text-gray-light/400 focus:outline-none cursor-not-allowed "
        : "text-brand/700 hover:text-brand/800 focus:outline-none";
    } else if (color === "primary" && variant === "filled") {
      className += disabled
        ? "text-gray-light/400 bg-gray-light/100 border border-gray-light/200 focus:outline-none cursor-not-allowed"
        : "text-white bg-brand/900 hover:bg-brand/700 focus:outline-none focus:ring focus:ring-offset-0 focus:ring-[#42307D3D]";
    } else if (color === "primary" && variant === "outlined") {
      className += disabled
        ? "text-gray-light/400 bg-white border border-gray-light/200 focus:outline-none cursor-not-allowed"
        : "text-brand/700 hover:text-brand/800 bg-white hover:bg-brand/50 border border-brand/300 focus:outline-none focus:ring focus:ring-offset-0 focus:ring-[#42307D3D]";
    } else if (color === "primary" && variant === "filledTonal") {
      className += disabled
        ? "text-gray-light/400 focus:outline-none cursor-not-allowed "
        : "text-brand/700 hover:text-brand/800 bg-brand/50 focus:outline-none";
    } else if (color === "gray" && variant === "text") {
      className += disabled
        ? "text-gray-light/400 focus:outline-none cursor-not-allowed"
        : "text-gray-light/500 hover:text-gray-light/600 focus:outline-none";
    } else if (color === "gray" && variant === "outlined") {
      className += disabled
        ? "text-gray-light/400 bg-white border border-gray-light/200 focus:outline-none cursor-not-allowed"
        : "text-gray-light/500 hover:text-gray-light/600 bg-white hover:bg-gray-light/50 border border-gray-gray-light/300 focus:outline-none focus:ring focus:ring-offset-0 focus:ring-[#98A2B324]";
    } else if (color === "gray" && variant === "filled") {
      className += disabled
        ? "text-gray-light/400 bg-gray-light/100 border border-gray-light/200 focus:outline-none cursor-not-allowed"
        : "text-white bg-gray-light/600 hover:bg-gray-light/700 focus:outline-none focus:ring focus:ring-offset-0 focus:ring-[#98A2B324]";
    } else if (color === "gray" && variant === "filledTonal") {
      className += disabled
        ? "text-gray-light/400 focus:outline-none cursor-not-allowed "
        : "text-gray-light/500 hover:text-gray-light/600 bg-gray-light/50 focus:outline-none";
    } else if (color === "error" && variant === "text") {
      className += disabled
        ? "text-gray-light/400 focus:outline-none cursor-not-allowed "
        : "text-error/700 hover:text-error/800 focus:outline-none";
    } else if (color === "error" && variant === "outlined") {
      className += disabled
        ? "text-gray-light/400 bg-white border border-gray-light/200 focus:outline-none cursor-not-allowed"
        : "text-error/700 hover:text-error/800 bg-white hover:bg-error/50 border border-error/300 focus:outline-none focus:ring focus:ring-offset-0 focus:ring-[#f044383d]";
    } else if (color === "error" && variant === "filled") {
      className += disabled
        ? "text-gray-light/400 bg-gray-light/100 border border-gray-light/200 focus:outline-none cursor-not-allowed"
        : "text-white bg-error/600 hover:bg-error/700 focus:outline-none focus:ring focus:ring-offset-0 focus:ring-[#f044383d]";
    } else if (color === "error" && variant === "filledTonal") {
      className += disabled
        ? "text-gray-light/400 focus:outline-none cursor-not-allowed "
        : "text-error/700 hover:text-error/800 bg-error/50 focus:outline-none";
    } else if (color === "warning" && variant === "text") {
      className += disabled
        ? "text-gray-light/400 focus:outline-none cursor-not-allowed "
        : "text-warning/700 hover:text-warning/800 focus:outline-none";
    } else if (color === "warning" && variant === "outlined") {
      className += disabled
        ? "text-gray-light/400 bg-white border border-gray-light/200 focus:outline-none cursor-not-allowed"
        : "text-warning/700 hover:text-warning/800 bg-white hover:bg-warning/50 border border-warning/300 focus:outline-none focus:ring focus:ring-offset-0 focus:ring-[#f790093d]";
    } else if (color === "warning" && variant === "filled") {
      className += disabled
        ? "text-gray-light/400 bg-gray-light/100 border border-gray-light/200 focus:outline-none cursor-not-allowed"
        : "text-white bg-warning/600 hover:bg-warning/700 focus:outline-none focus:ring focus:ring-offset-0 focus:ring-[#f790093d]";
    } else if (color === "warning" && variant === "filledTonal") {
      className += disabled
        ? "text-gray-light/400 focus:outline-none cursor-not-allowed "
        : "text-warning/700 hover:text-warning/800 bg-warning/50 focus:outline-none";
    } else if (color === "success" && variant === "text") {
      className += disabled
        ? "text-gray-light/400 focus:outline-none cursor-not-allowed "
        : "text-success/700 hover:text-success/800 focus:outline-none";
    } else if (color === "success" && variant === "outlined") {
      className += disabled
        ? "text-gray-light/400 bg-white border border-gray-light/200 focus:outline-none cursor-not-allowed"
        : "text-success/700 hover:text-success/800 bg-white hover:bg-success/50 border border-success/300 focus:outline-none focus:ring focus:ring-offset-0 focus:ring-[#17b26a3d]";
    } else if (color === "success" && variant === "filled") {
      className += disabled
        ? "text-gray-light/400 bg-gray-light/100 border border-gray-light/200 focus:outline-none cursor-not-allowed"
        : "text-white bg-success/600 hover:bg-success/700 focus:outline-none focus:ring focus:ring-offset-0 focus:ring-[#17b26a3d]";
    } else if (color === "success" && variant === "filledTonal") {
      className += disabled
        ? "text-gray-light/400 focus:outline-none cursor-not-allowed "
        : "text-success/700 hover:text-success/800 bg-success/50 focus:outline-none";
    } else if (color === "modern" && variant === "outlined") {
      className +=
        " text-gray-light/700 border border-gray-light/300 bg-white shadow-shadows/shadow-xs focus:outline-none";
    }

    if (size === "sm") {
      className += " p-2";
    } else if (size === "md") {
      className += " p-2.5";
    } else if (size === "lg") {
      className += " p-3";
    } else if (size === "xl") {
      className += " p-[14px]";
    }

    if (rounded === "none") {
      className += " rounded-none";
    } else if (rounded === "sm") {
      className += " rounded-sm";
    } else if (rounded === "md") {
      className += " rounded-md";
    } else if (rounded === "lg") {
      className += " rounded-lg";
    } else if (rounded === "xl") {
      className += " rounded-xl";
    } else if (rounded === "2xl") {
      className += " rounded-2xl";
    } else if (rounded === "3xl") {
      className += " rounded-3xl";
    } else if (rounded === "full") {
      className += " rounded-full";
    }

    return className;
  }, [color, variant, size, rounded, disabled]);

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={makeStyle}
      >
        {children}
      </button>
    </>
  );
};

export default MyButtonIcon;
