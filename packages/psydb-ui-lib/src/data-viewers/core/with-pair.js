import React from 'react';
import { Pair } from '@mpieva/psydb-ui-layout';

export const withPair = (Component) => {
    var PairWrapper = (ps) => {
        var { label, handleMissing = 'warn', value, noWrapper } = ps;
        
        var content;
        if (Component) {
            content = <Component { ...ps } />
        }
        else {
            if (value === undefined) {
                if (handleMissing === 'warn') {
                    content = <span className='bs5 text-danger'>Fehlt</span>
                }
                else {
                    content = '';
                }
            }
            else if (!value) {
                content = String(value);
            }
            else {
                content = value;
            }
        }

        return (
            noWrapper
            ? content
            : (
                <Pair label={ label }>
                    { content }
                </Pair>
            )
        );
    }
    return PairWrapper;
}
