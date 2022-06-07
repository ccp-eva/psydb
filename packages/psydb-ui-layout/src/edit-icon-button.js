import React from 'react';

import { Button } from 'react-bootstrap';
import { PencilFill } from 'react-bootstrap-icons';
import LinkButton from './link-button';

var buttonProps = {
    size: 'sm',
    variant: 'outline-primary'
}

var iconStyle = {
    width: '20px', marginTop: '-3px'
}

const EditIconButton = ({
    className,
    to,
    onClick,
    title,
}) => {
    if (to) {
        return (
            <LinkButton
                { ...buttonProps }
                className={ className }
                to={ to }
                title={ title || 'Bearbeiten' }
            >
                <PencilFill style={ iconStyle } />
            </LinkButton>
        )
    }
    else {
        return (
            <Button
                { ...buttonProps }
                className={ className }
                onClick={ onClick }
                title={ title || 'Bearbeiten' }
            >
                <PencilFill style={ iconStyle } />
            </Button>
        )
    }
}

export default EditIconButton;
