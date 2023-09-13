import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { GenericEnum } from './generic-enum';

const options = {
    'male': 'Male',
    'female': 'Female',
    'unknown': 'Unknown',
}

export const BiologicalGender = (ps) => {
    var translate = useUITranslation();
    return (
        <GenericEnum
            options={ translate.options(options) }
            { ...ps }
        />
    )
}
