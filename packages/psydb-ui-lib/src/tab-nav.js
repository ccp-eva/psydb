import React, { useState, useEffect, useReducer } from 'react';

import {
    Nav
} from 'react-bootstrap';

const TabNav = ({
    items,
    activeKey,
    onItemClick,
}) => {
    return (
        <Nav variant='tabs'>
            { items.map(it => (
                <Nav.Item
                    key={ it.key }
                    onClick={ onItemClick }
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

