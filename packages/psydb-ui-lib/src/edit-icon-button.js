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
    to,
    onClick
}) => {
    if (to) {
        return (
            <LinkButton
                { ...buttonProps }
                to={ to }
            >
                <PencilFill style={ iconStyle } />
            </LinkButton>
        )
    }
    else {
        return (
            <Button
                { ...buttonProps }
                onClick={ onClick }
            >
                <PencilFill style={ iconStyle } />
            </Button>
        )
    }
}

export default EditIconButton;
