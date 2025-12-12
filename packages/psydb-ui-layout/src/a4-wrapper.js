import React from 'react';

export const A4Wrapper = (ps) => {
    var {
        children, className,
        wrapperClassName = 'py-5'
    } = ps;

    return (
        <div className={ wrapperClassName } style={{
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
