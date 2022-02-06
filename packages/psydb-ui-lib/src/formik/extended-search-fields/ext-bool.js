import React from 'react';
import { GenericMultiCheckbox } from './generic-multi-checkbox';

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
