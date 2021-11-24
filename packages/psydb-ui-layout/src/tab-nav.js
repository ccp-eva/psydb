import React, { useState, useEffect, useReducer } from 'react';

import {
    Nav
} from 'react-bootstrap';

const styleBase = {
    borderRadius: 0,
    border: 0,
    backgroundColor: 'transparent',
}

const styleActive = {
    ...styleBase,
    color: '#006c66',
    borderBottom: '3px solid #006c66',
}

const styleInactive = {
    ...styleBase,
    color: 'black',
    borderBottom: '3px solid #dee2e6',
}

const TabNav = ({
    className,
    itemClassName,
    label,
    items,
    activeKey,
    onItemClick,
}) => {
    return (
            <Nav variant='tabs' className={ className }>
                { items.map(it => (
                    <Nav.Item
                        className={ itemClassName }
                        key={ it.key }
                        onClick={ () => onItemClick(it.key) }
                        style={{}}
                    >
                        <Nav.Link
                            active={ it.key === activeKey }
                            style={
                                it.key === activeKey
                                ? styleActive
                                : styleInactive
                            }
                        >
                            { it.label }
                        </Nav.Link>
                    </Nav.Item>
                ))}
            </Nav>
        /*<div className='d-flex border-bottom'>
            <div className='px-3 py-2'><b>{ label }</b></div>
        </div>*/
    );
}

export default TabNav

