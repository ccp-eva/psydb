import React from 'react';
import { GenericEnum } from './generic-enum';

const options = {
    'male': 'Männlich',
    'female': 'Weiblich',
    'unknown': 'Unbekannt',
}

export const BiologicalGender = (ps) => (
    <GenericEnum options={ options } { ...ps } />
)
