import React from 'react';

export const A4Wrapper = (ps) => {
    var {
        children, className,
        wrapperClassName = 'py-5',
        pageMargin = '20mm',
    } = ps;

    return (
        <div className={ wrapperClassName } style={{
            maxWidth: '210mm', marginLeft: 'auto', marginRight: 'auto'
        }}>
            <div className={ className } style={{
                padding: pageMargin
            }}>
                { children }
            </div>
        </div>
    )
}
