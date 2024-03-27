import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { Pair } from '@mpieva/psydb-ui-layout';

export const Field = (ps) => {
    var {
        label,
        handleMissing = 'warn',
        noWrapper,
        children,
        value,
        wLeft = 3,
        wRight = 9
    } = ps;

    var translate = useUITranslation();

    if (children === undefined) {
        if (handleMissing === 'warn') {
            children = (
                <span className='bs5 text-danger'>
                    { translate('Missing') }
                </span>
            )
        }
        else if (handleMissing === 'ignore') {
            children = '';
        }
    }
    else if (!children) {
        children = String(value);
    }
    else {
        children = children;
    }
    
    var pass = { wRight, wLeft };
    return (
        noWrapper
        ? children
        : (
            <Pair label={ label } { ...pass } noPaddedText={ true }>
                { children }
            </Pair>
        )
    );
}
