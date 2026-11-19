import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { GenericMultiCheckbox } from './generic-multi-checkbox';

const options = {
    'male': 'Male',
    'female': 'Female',
    'other': 'Other',
    'unknown': 'Unknown',
}

export const BiologicalGender = (ps) => {
    var [{ translate }] = useI18N();
    return (
        <GenericMultiCheckbox
            options={ translate.options(options) }
            { ...ps }
        />
    )
}
