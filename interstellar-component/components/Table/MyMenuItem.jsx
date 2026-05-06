import React, { } from "react";

const MyMenuItem = ({ children, value, values, statusShow, handleClose, onClick }) => {
    return (
        <div className="flex py-px px-1.5">
            <button type="button"
                className="hover:bg-gray-light/50 flex justify-start gap-2 rounded-md w-full px-2.5 py-[9px]"
                onClick={() => {
                    onClick && onClick(value, values);
                    handleClose && handleClose();
                }}>
                {children}
            </button>
        </div>
    );
};


export default MyMenuItem;