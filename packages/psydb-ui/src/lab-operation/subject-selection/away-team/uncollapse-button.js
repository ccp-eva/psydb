import React from 'react';

import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import { CaretUpFill, CaretDownFill } from 'react-bootstrap-icons';

var defaultIconStyle = {
    width: '16px',
    height: '16px',
    marginLeft: '7px',
    color: '#006c66',
}

var UncollapseButton = ({
    onClick,
    iconStyle,
    direction,
}) => {
    return (
        <a role='button' onClick={ onClick }>
            <b style={{ color: '#006c66' }}>Details:</b>
            {
                direction === 'down'
                ? <CaretDownFill style={{ ...defaultIconStyle, ...iconStyle }} />
                : <CaretUpFill style={{ ...defaultIconStyle, ...iconStyle }} />
            }
        </a>
    )
}

export default UncollapseButton;
