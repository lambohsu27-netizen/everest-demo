import React from "react";

const MyTabPanel = ({ children, value }) => {
    return (
        <div className="min-w-full h-full">
            {children}
        </div>
    );
};

export default MyTabPanel;