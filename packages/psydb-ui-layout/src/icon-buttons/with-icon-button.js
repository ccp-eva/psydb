import React from 'react';

import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const factoryButtonProps = {
    size: 'sm',
    variant: 'outline-primary',
}
const factoryButtonStyle = {
    marginTop: '-3px', // FIXME: in lists only
    borderRadius: '.2rem',
    border: 0,
}

const factoryIconStyle = {
    width: '20px',
    height: '20px',
    marginTop: '-2px'
}

export const withIconButton = (options) => {
    var {
        Icon,
        defaultButtonProps = factoryButtonProps,
        defaultButtonStyle = factoryButtonStyle,
        defaultIconStyle = factoryIconStyle
    } = options;

    var IconButton = (ps) => {
        var {
            to,
            onClick,
            buttonProps,
            buttonStyle,
            iconStyle,
            target,
        } = ps;

        var mergedButtonProps = { ...defaultButtonProps, ...buttonProps };
        var mergedButtonStyle = { ...defaultButtonStyle, ...buttonStyle };
        var mergedIconStyle = { ...defaultIconStyle, ...iconStyle };

        if (to && !target) {
            return (
                <LinkContainer to={ to } style={ mergedButtonStyle }>
                    <Button { ...mergedButtonProps }>
                        <Icon style={ mergedIconStyle } />
                    </Button>
                </LinkContainer>
            )    
        }
        else if (to && target) {
            return (
                <Button
                    as='a' target={ target }
                    href={ '/#' + to }
                    { ...mergedButtonProps }
                    style={ mergedButtonStyle }
                >
                    <Icon style={ mergedIconStyle } />
                </Button>
            )
        }
        else {
            return (
                <Button
                    { ...mergedButtonProps }
                    style={ mergedButtonStyle }
                >
                    <Icon style={ mergedIconStyle } />
                </Button>
            )
        }
    }

    return IconButton;
}
