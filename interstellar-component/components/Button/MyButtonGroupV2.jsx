import React from "react";
import SimpleBar from "simplebar-react";
import MyButton from "./MyButton";

const MyButtonGroupV2 = ({ buttons, value, onChange, disabled = false }) => {
  return (
    <>
      {buttons && buttons.length && (
        <div className="w-max flex border border-gray-light/300 rounded-lg shadow-shadows/shadow-xs overflow-hidden">
          {buttons.map((e, i) => {
            return (
              <div
                key={i}
                onClick={() => {
                  if (onChange && !disabled) onChange(e?.value);
                }}
                className={`${
                  e?.value === value ? "bg-gray-light/50" : ""
                } px-4 py-2 border-r border-border-gray-light/300 last:border-0 ${disabled ? "cursor-not-allowed" : ""}`}
              >
                <MyButton color={"secondary"} variant={"text"} disabled={disabled}>
                  <p className="text-sm-semibold">{e?.label}</p>
                </MyButton>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default MyButtonGroupV2;
