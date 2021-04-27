import React, { useState, useEffect, useReducer } from 'react';

import {
    Nav
} from 'react-bootstrap';

const TabNav = ({
    className,
    itemClassName,
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
                >
                    <Nav.Link
                        active={ it.key === activeKey }
                    >
                        { it.label }
                    </Nav.Link>
                </Nav.Item>
            ))}
        </Nav>
    );
}

export default TabNav

