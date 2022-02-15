import React from 'react';

import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import { PencilFill } from 'react-bootstrap-icons';
const Icon = PencilFill;

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

var EditIconButtonInline = ({
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
                    <Icon style={{ ...defaultIconStyle, ...iconStyle }} />
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
                <Icon style={{ ...defaultIconStyle, ...iconStyle }} />
            </Button>
        )
    }
    else {
        var buttonProps = { ...defaultButtonProps, onClick };
        return (
            <Button { ...buttonProps } style={{
                ...defaultButtonStyle, ...buttonStyle
            }}>
                <Icon style={{ ...defaultIconStyle, ...iconStyle }} />
            </Button>
        )
    }
}

export default EditIconButtonInline;
