import React, { useState, useEffect, useReducer } from 'react';

const styles = {
    label: {
        paddingTop: 'calc(.375rem + 1px)',
        paddingBottom: 'calc(.375rem + 1px)',
        lineHeight: '1.5',
    },
    value: {
        //height: 'calc(1.5em + .75rem + 2px)',
        padding: 'calc(.375rem + 1px) calc(.75rem + 1px)',
        lineHeight: '1.5',
        border: '1px solid transparent',
    }
}

export const InlineWrapper = (ps) => {
    var {
        label,
        valueStyle,
        uiSplit = [3,9],
        uiHrTop = false,
        children,
    } = ps;

    return (
        <>
            { uiHrTop && (
                <hr />
            )}
            <div className='row mr-0 ml-0'>
                <header className={ `col-sm-${uiSplit[0]}` }>
                    <div style={ styles.label }>
                        { label }
                    </div>
                </header>
                <div className={ `col-sm-${uiSplit[1]} p-0` }>
                    <div style={ valueStyle || styles.value }>
                        { children }
                    </div>
                </div>
            </div>
        </>
    )
}

export const OneLineWrapper = (ps) => {
    var { label, children, valueStyle } = ps;
    return (
        <div className='row mr-0 ml-0'>
            <div className='p-0'>
                <div style={ valueStyle || styles.value }>
                    { children }
                </div>
            </div>
        </div>
    )
}

export const PlainWrapper = (ps) => {
    var { children } = ps;
    return (
        <>{ children }</>
    )
}
