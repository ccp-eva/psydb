import React from 'react';

import {
    Button
} from 'react-bootstrap';

const styleBase = {
    borderRadius: '.2rem',
    border: 0,
    marginRight: '.25rem'
}

const TableButton = ({ style, ...other }) => {
    return (
        <Button { ...({
            style: { ...styleBase, ...style },
            size: 'sm',
            variant: 'outline-primary',
            ...other
        }) } />
    )
}

export default TableButton;
