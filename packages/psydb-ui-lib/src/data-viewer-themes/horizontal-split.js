import React from 'react';
import { Pair } from '@mpieva/psydb-ui-layout';

export const Field = (ps) => {
    var { label, handleMissing = 'warn', noWrapper, children } = ps;

    if (children === undefined) {
        if (handleMissing === 'warn') {
            children = <span className='bs5 text-danger'>Fehlt</span>
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
    
    return (
        noWrapper
        ? children
        : (
            <Pair label={ label }>
                { children }
            </Pair>
        )
    );
}
