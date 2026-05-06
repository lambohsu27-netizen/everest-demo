import React from "react";
import SimpleBar from "simplebar-react";
import MyButton from "./MyButton";

const MyButtonGroup = ({ buttons, value, onChange }) => {
    return (
        <>
            {buttons && buttons.length &&
                <div className="w-max flex border border-gray-light/300 rounded-lg shadow-shadows/shadow-xs overflow-hidden">
                    {buttons.map((e, i) => {
                        return (
                        <div 
                            key={i} 
                            onClick={() => { onChange && onChange(e);}} 
                            className={`${e === value ? 'bg-gray-light/50' : ''} px-4 py-2 border-r border-border-gray-light/300 last:border-0`}>
                                <MyButton color={"secondary"} variant={'text'} >
                                    <p className="text-sm-semibold">{e}</p>
                                </MyButton>
                        </div>
                        )
                    })}
                </div>
            }
        </>
    );
};

export default MyButtonGroup;