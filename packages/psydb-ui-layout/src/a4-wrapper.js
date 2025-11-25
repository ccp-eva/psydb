import React from 'react';

export const A4Wrapper = (ps) => {
    var { children, className } = ps;
    return (
        <div className='pt-5 pb-5' style={{
            maxWidth: '210mm', marginLeft: 'auto', marginRight: 'auto'
        }}>
            <div className={ className } style={{
                padding: '20mm'
            }}>
                { children }
            </div>
        </div>
    )
}
