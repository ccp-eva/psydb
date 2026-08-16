import React from 'react';
import * as Options from '../common-options';

export const SaneString = (ps) => {
    return (
        <>
            <Options.MinLengthProp { ...ps } />
        </>
    )
}

export const FullText = (ps) => {
    return (
        <>
            <Options.MinLengthProp { ...ps } />
            <Options.IsSensitiveProp { ...ps } />
        </>
    )
}
