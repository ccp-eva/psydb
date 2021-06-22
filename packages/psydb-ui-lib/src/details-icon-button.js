import React from 'react';

import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import { FileText, JournalText, CardList } from 'react-bootstrap-icons';

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
}) => {
    if (to) {
        return (
            <LinkContainer to={ to } style={{
                ...defaultButtonStyle,
                ...buttonStyle,
            }}>
                <Button { ...defaultButtonProps }>
                    <CardList style={{ ...defaultIconStyle, ...iconStyle }} />
                </Button>
            </LinkContainer>
        )    
    }
    else {
        return (
            <Button { ...buttonProps } style={{
                ...defaultButtonStyle, ...buttonStyle
            }}>
                <CardList style={{ ...defaultIconStyle, ...iconStyle }} />
            </Button>
        )
    }
}

export default DetailsIconButton;
