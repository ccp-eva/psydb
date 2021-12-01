import React from 'react';
import WithField from '../with-field';
import { GenericMultiCheckbox } from './generic-multi-checkbox';

export { SaneString } from '../fields';

export const BiologicalGender = (ps) => (
    <GenericMultiCheckbox
        options={{
            'male': 'Männlich',
            'female': 'Weiblich',
        }}
        { ...ps }
    />
)

export const ExtBool = (ps) => (
    <GenericMultiCheckbox
        options={{
            'yes': 'Ja',
            'no': 'Nein',
            'unknown': 'Unbekannt',
        }}
        { ...ps }
    />
)


