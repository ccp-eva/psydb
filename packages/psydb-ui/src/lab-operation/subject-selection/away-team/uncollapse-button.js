import React from 'react';

import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import { CaretUpFill, CaretDownFill } from 'react-bootstrap-icons';

var defaultButtonProps = {
    size: 'sm',
    variant: 'outline-primary',
}
var defaultButtonStyle = {
    marginTop: '-3px', // FIXME: in lists only
    borderRadius: '.2rem',
    border: 0,
}

var defaultIconStyle = {
    width: '16px',
    height: '16px',
    marginTop: '-2px'
}

var UncollapseButton = ({
    onClick,
    buttonStyle,
    iconStyle,
    direction,
    ...buttonProps
}) => {
    return (
        <Button { ...defaultButtonProps } { ...buttonProps } style={{
            ...defaultButtonStyle, ...buttonStyle
        }}>
            {
                direction === 'down'
                ? <CaretDownFill style={{ ...defaultIconStyle, ...iconStyle }} />
                : <CaretUpFill style={{ ...defaultIconStyle, ...iconStyle }} />
            }
        </Button>
    )
}

export default UncollapseButton;
