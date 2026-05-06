import React from "react";

const MyTabView = ({ children, value }) => {
    const activeIdx = React.useMemo(() => {
        let idx = null;
        React.Children.forEach(children, (child, index) => {
            if (value === child.props.value) {
                idx = index;
                return false;
            }
        });

        return idx;
    }, [children, value]);

    const getStyle = (index) => {
        let style = {};
        if (index !== activeIdx) {
            style.transform = `translateX(${(index > activeIdx) ? 100 : -100}%)`
            style.opacity = 0;
        } else {
            style.transform = 'translateX(0)';
            style.opacity = 1;
        }

        return style;
    }

    return (
        <div className={`w-full min-h-full min-w-full max-w-full relative overflow-hidden`}>
            {children && React.Children.map(children, (child, index) => {
                return <div style={getStyle(index)} className={`absolute min-w-full max-w-full duration-500 h-full ${index === activeIdx ? 'z-20' : 'z-10'}`}>
                    {(React.cloneElement(child, { "key": index }))}
                </div>
            })}
        </div>
    );
};

export default MyTabView;