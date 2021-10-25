import React from 'react';
import WithField from '../../with-field';
import { GenericEnum } from './generic-enum';

const options = {
    'yes': 'Ja',
    'no': 'Nein',
    'unknown': 'Unbekannt',
}

export const ExtBool = (ps) => (
    <GenericEnum options={ options } { ...ps } />
)
