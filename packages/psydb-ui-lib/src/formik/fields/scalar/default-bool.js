import React from 'react';
import WithField from '../../with-field';
import { GenericEnum } from './generic-enum';

const enumeration = {
    keys: [ true, false ],
    labels: [ 'Ja', 'Nein' ],
}

export const DefaultBool = (ps) => (
    <GenericEnum enum={ enumeration } { ...ps } />
)
