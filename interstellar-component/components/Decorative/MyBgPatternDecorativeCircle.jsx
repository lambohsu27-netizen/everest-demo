import React from "react";

const MyBgPatternDecorativeCircle = ({ children, originClass = 'items-center justify-center' }) => {
    return (
        <div className={`w-max relative flex ${originClass} z-10`}>
            <div className="z-20">
                {children}
            </div>
            <div className={`bg-gradient-radial w-[336px] h-[336px] absolute flex items-center justify-center`}>
                <span className="block w-24 h-24 absolute border rounded-full border-gray-light/200"></span>
                <span className="block w-36 h-36 absolute border rounded-full border-gray-light/200/80"></span>
                <span className="block w-48 h-48 absolute border rounded-full border-gray-light/200/60"></span>
                <span className="block w-60 h-60 absolute border rounded-full border-gray-light/200/40"></span>
                <span className="block w-72 h-72 absolute border rounded-full border-gray-light/200/20"></span>
                <span className="block w-[336px] h-[336px] absolute rounded-full"></span>
            </div>
        </div>
    );
};

export default MyBgPatternDecorativeCircle;