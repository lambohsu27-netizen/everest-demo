import React, { } from "react";

const MyRow = ({ children, tag }) => {
    return (
        <tr className="hover:bg-gray-light/25" >
            {React.Children.map(children, (child, index) => {
                return React.cloneElement(child, { tag: tag, index: index, key: index });
            })}
        </tr>
    );
};


export default MyRow;