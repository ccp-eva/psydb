import React from 'react';

import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import { FileText, JournalText, CardList } from 'react-bootstrap-icons';

var buttonProps = {
    size: 'sm',
    variant: 'outline-primary',
    style: {
        marginTop: '-3px', // FIXME: in lists only
        borderRadius: '.2rem',
        border: 0,
    }
}

var iconStyle = {
    width: '20px',
    height: '20px',
    marginTop: '-3px'
}

var DetailsIconButton = ({
    to,
    onClick
}) => {
    if (to) {
        return (
            <LinkContainer to={ to } style={ buttonProps.style }>
                <Button { ...buttonProps }>
                    <CardList style={ iconStyle } />
                </Button>
            </LinkContainer>
        )    
    }
    else {
        return (
            <Button { ...buttonProps }>
                <FileText style={ iconStyle } />
            </Button>
        )
    }
}

export default DetailsIconButton;
