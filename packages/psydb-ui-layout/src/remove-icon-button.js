import React from 'react';

import { Button } from 'react-bootstrap';
import { XLg } from 'react-bootstrap-icons';
import LinkButton from './link-button';

var buttonProps = {
    size: 'sm',
    variant: 'outline-danger'
}

var iconStyle = {
    height: '13px',
    width: '20px',
    marginTop: '-2px'
}

const RemoveIconButton = ({
    className,
    to,
    onClick
}) => {
    if (to) {
        return (
            <LinkButton
                { ...buttonProps }
                className={ className }
                to={ to }
            >
                <XLg style={ iconStyle } />
            </LinkButton>
        )
    }
    else {
        return (
            <Button
                { ...buttonProps }
                className={ className }
                onClick={ onClick }
            >
                <XLg style={ iconStyle } />
            </Button>
        )
    }
}

export default RemoveIconButton;
