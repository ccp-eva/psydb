import React from 'react';
import { Control } from './core';

export const SaneString = (ps) => {
    var {
        // FIXME: why are thei here?
        enableUnknownValue,
        extraContentWrapperProps,
        extraItemWrapperProps,
        ...pass
    } = ps;
    return (
        <Control type='text'  { ...pass } />
    )
}
