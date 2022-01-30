import React from 'react';
import { Control } from './core';

export const SaneString = (ps) => {
    return (
        <Control type='text'  {...ps} />
    )
}
