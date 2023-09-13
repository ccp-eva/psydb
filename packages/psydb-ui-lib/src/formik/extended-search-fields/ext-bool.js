import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { GenericMultiCheckbox } from './generic-multi-checkbox';

const options = {
    'yes': 'Yes',
    'no': 'No',
    'unknown': 'Unknown',
}

export const ExtBool = (ps) => {
    var translate = useUITranslation();
    return (
        <GenericMultiCheckbox
            options={ translate.options(options) }
            { ...ps }
        />
    )
}
