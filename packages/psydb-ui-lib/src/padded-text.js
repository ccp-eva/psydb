import React from 'react';

const PaddedText = ({ children }) => {
    return (
        <div style={{
            paddingTop: 'calc(0.375rem + 1px)',
            paddingBottom: 'calc(0.375rem + 1px)',
        }}>{ children }</div>
    );
}

export default PaddedText;
