import React, { } from "react";

const MyColumnGroup = ({ children, tag }) => {
    return (
        <>
            {React.Children.map(children, (child, index) => {
                return React.cloneElement(child, { tag: "td", key: index });
            })}
        </>
    );
};


export default MyColumnGroup;