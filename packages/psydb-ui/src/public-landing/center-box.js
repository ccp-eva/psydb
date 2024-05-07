import React from 'react';

const CenterBox = (ps) => {
    var { children } = ps;
    return (
        <div style={{
            width: '500px',
            position: 'absolute',
            top: '42%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
        }}>
            { children }
        </div>
    );
}

export default CenterBox;
