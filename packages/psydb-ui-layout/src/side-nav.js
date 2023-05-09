import React, { useState, useEffect, useReducer } from 'react';

import {
    Nav
} from 'react-bootstrap';

const styleBase = {
    display: 'block',
    borderRadius: 0,
    border: 0,
    backgroundColor: 'transparent',
    padding: '0.5rem 1rem',
}

const styleDisabled = {
    ...styleBase,
    color: '#ccc',
    borderRight: '3px solid #dee2e6',
    cursor: 'default'
}

const styleActive = {
    ...styleBase,
    color: '#006c66',
    borderRight: '3px solid #006c66',
}

const styleInactive = {
    ...styleBase,
    color: 'black',
    borderRight: '3px solid #dee2e6',
}

const SideNav = ({
    className,
    itemClassName,
    label,
    items,
    remap,
    activeKey,
    onItemClick,
}) => {
    if (remap[activeKey]) {
        activeKey = remap[activeKey];
    }
    return (
            <nav className={ className }>
                { items
                    .filter(it => (
                        it.hasOwnProperty('show')
                        ? it.show
                        : true
                    ))
                    .map(it => (
                        <a
                            key={ it.key }
                            className={ itemClassName }
                            onClick={
                                it.disabled || it.key === activeKey
                                ? undefined
                                : () => onItemClick(it.key)
                            }
                            style={
                                it.disabled
                                ? styleDisabled
                                : (
                                    it.key === activeKey
                                    ? styleActive
                                    : styleInactive
                                )
                            }
                        >
                            { it.label }
                        </a>
                    ))
                }
            </nav>
        /*<div className='d-flex border-bottom'>
            <div className='px-3 py-2'><b>{ label }</b></div>
        </div>*/
    );
}

export default SideNav

