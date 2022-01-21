import React from 'react';

import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import { CalendarDate } from 'react-bootstrap-icons';

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
    width: '20px',
    height: '20px',
    marginTop: '-2px'
}

var DetailsIconButton = ({
    to,
    onClick,
    buttonStyle,
    iconStyle,
    target,
}) => {
    if (to && !target) {
        return (
            <LinkContainer to={ to } style={{
                ...defaultButtonStyle,
                ...buttonStyle,
            }}>
                <Button { ...defaultButtonProps }>
                    <CalendarDate style={{ ...defaultIconStyle, ...iconStyle }} />
                </Button>
            </LinkContainer>
        )    
    }
    else if (to && target) {
        return (
            <Button
                as='a' target={ target }
                href={ '/#' + to }
                style={{
                    ...defaultButtonStyle,
                    ...buttonStyle,
                }}
                { ...defaultButtonProps }>
                <CalendarDate style={{ ...defaultIconStyle, ...iconStyle }} />
            </Button>
        )
    }
    else {
        return (
            <Button { ...buttonProps } style={{
                ...defaultButtonStyle, ...buttonStyle
            }}>
                <CalendarDate style={{ ...defaultIconStyle, ...iconStyle }} />
            </Button>
        )
    }
}

export default DetailsIconButton;
