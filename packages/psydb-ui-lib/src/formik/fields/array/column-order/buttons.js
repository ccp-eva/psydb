import React from 'react';
import { Icons } from '@mpieva/psydb-ui-layout';

export const UpButton = (ps) => {
    var { onClick, disabled } = ps;
    return (
        <span
            onClick={ disabled ? undefined : onClick }
            role={ disabled ? '' : 'button' }
            className={ disabled ? 'text-muted' : 'text-primary' }
        >
            <Icons.ArrowUpShort style={{
                width: '24px',
                height: '24px',
                marginTop: '1px'
            }} />
        </span>
    )
}

export const DownButton = (ps) => {
    var { onClick, disabled } = ps;
    return (
        <span
            onClick={ disabled ? undefined : onClick }
            role={ disabled ? '' : 'button' }
            className={ disabled ? 'text-muted' : 'text-primary' }
        >
            <Icons.ArrowDownShort style={{
                width: '24px',
                height: '24px',
                marginTop: '1px'
            }} />
        </span>
    )
}
