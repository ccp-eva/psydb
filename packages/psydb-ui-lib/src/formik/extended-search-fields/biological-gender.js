import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { GenericMultiCheckbox } from './generic-multi-checkbox';

const options = {
    'male': 'Male',
    'female': 'Female',
    'other': 'Other',
    'unknown': 'Unknown',
}

export const BiologicalGender = (ps) => {
    var translate = useUITranslation();
    return (
        <GenericMultiCheckbox
            options={ translate.options(options) }
            { ...ps }
        />
    )
}
