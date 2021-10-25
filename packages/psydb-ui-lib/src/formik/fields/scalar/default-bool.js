import React from 'react';
import WithField from '../../with-field';
import { GenericEnum } from './generic-enum';

const options = {
    [true]: 'Ja',
    [false]: 'Nein',
}

export const DefaultBool = (ps) => (
    <GenericEnum options={ options } { ...ps } />
)
