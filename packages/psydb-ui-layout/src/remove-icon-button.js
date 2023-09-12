import React from 'react';

import { Button } from 'react-bootstrap';
import { XLg } from 'react-bootstrap-icons';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
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

const RemoveIconButton = (ps) => {
    var {
        className,
        to,
        onClick,
        title,
    } = ps;

    var translate = useUITranslation();

    if (to) {
        return (
            <LinkButton
                { ...buttonProps }
                className={ className }
                to={ to }
                title={ title || translate('Delete') }
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
                title={ title || translate('Delete') }
            >
                <XLg style={ iconStyle } />
            </Button>
        )
    }
}

export default RemoveIconButton;
