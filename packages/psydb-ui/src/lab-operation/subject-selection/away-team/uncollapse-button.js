import React from 'react';

import {
    Button,
    LinkContainer,
    Icons,
} from '@mpieva/psydb-ui-layout';

var defaultIconStyle = {
    width: '16px',
    height: '16px',
    marginLeft: '7px',
    color: '#006c66',
}

var UncollapseButton = ({
    onClick,
    iconStyle,
    direction,
}) => {
    return (
        <a role='button' onClick={ onClick }>
            <b style={{ color: '#006c66' }}>Details:</b>
            {
                direction === 'down'
                ? <Icons.CaretDownFill style={{ ...defaultIconStyle, ...iconStyle }} />
                : <Icons.CaretUpFill style={{ ...defaultIconStyle, ...iconStyle }} />
            }
        </a>
    )
}

export default UncollapseButton;
