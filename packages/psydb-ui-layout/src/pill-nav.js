import React, { useState, useEffect, useReducer } from 'react';

import {
    Button
} from 'react-bootstrap';

const styleBase = {
    borderRadius: '.2rem',
    border: 0,
    marginRight: '.25rem'
}

const styleActive = {
    ...styleBase,
    //color: '#006c66',
    //borderBottom: '3px solid #006c66',
}

const styleInactive = {
    ...styleBase,
    //color: 'black',
    //borderBottom: '3px solid #dee2e6',
}

const PillNav = ({
    className,
    itemClassName,
    items,
    activeKey,
    onItemClick,
}) => {
    return (
        <div className={ className }>
            { items.map(it => (
                <Button
                    className={ itemClassName }
                    key={ it.key }
                    onClick={ () => onItemClick(it.key) }
                    size='sm'
                    variant={
                        it.key === activeKey
                        ? 'primary'
                        : 'outline-primary'
                    }
                    style={
                        it.key === activeKey
                        ? styleActive
                        : styleInactive
                    }
                >
                    { it.label }
                </Button>
            ))}
        </div>
    );
}

export default PillNav

