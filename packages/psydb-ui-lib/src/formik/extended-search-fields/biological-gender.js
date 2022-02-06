import React from 'react';
import { GenericMultiCheckbox } from './generic-multi-checkbox';

export const BiologicalGender = (ps) => (
    <GenericMultiCheckbox
        options={{
            'male': 'Männlich',
            'female': 'Weiblich',
            'unknown': 'Unbekannt',
        }}
        { ...ps }
    />
)
