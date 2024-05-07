import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';

import {
    Button,
    LinkContainer,
    Icons,
} from '@mpieva/psydb-ui-layout';

var defaultIconStyle = {
    width: '16px',
    height: '16px',
    marginLeft: '7px',
    color: 'var(--primary)',
}

var UncollapseButton = (ps) => {
    var {
        onClick,
        iconStyle,
        direction,
    } = ps;

    var translate = useUITranslation();
    var style = { ...defaultIconStyle, ...iconStyle };
    return (
        <a role='button' onClick={ onClick }>
            <b style={{ color: 'var(--primary)' }}>
                { translate('Details') }:
            </b>
            {
                direction === 'down'
                ? <Icons.CaretDownFill style={ style } />
                : <Icons.CaretUpFill style={ style } />
            }
        </a>
    )
}

export default UncollapseButton;
