import React from 'react';
import WithField from '../../with-field';
import { GenericEnum } from './generic-enum';

const options = {
    'male': 'Männlich',
    'female': 'Weiblich',
}

export const BiologicalGender = (ps) => (
    <GenericEnum options={ options } { ...ps } />
)
