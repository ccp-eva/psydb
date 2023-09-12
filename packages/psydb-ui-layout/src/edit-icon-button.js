import React from 'react';

import { Button } from 'react-bootstrap';
import { PencilFill } from 'react-bootstrap-icons';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import LinkButton from './link-button';

var buttonProps = {
    size: 'sm',
    variant: 'outline-primary'
}

var iconStyle = {
    width: '20px', marginTop: '-3px'
}

const EditIconButton = (ps) => {
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
                title={ title || translate('Edit') }
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
                title={ title || translate('Edit') }
            >
                <PencilFill style={ iconStyle } />
            </Button>
        )
    }
}

export default EditIconButton;
