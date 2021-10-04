import React from 'react';

const PaddedText = ({ className, style, children }) => {
    return (
        <div className={ className } style={{
            paddingTop: 'calc(0.375rem + 1px)',
            paddingBottom: 'calc(0.375rem + 1px)',
            ...style
        }}>{ children }</div>
    );
}

export default PaddedText;
