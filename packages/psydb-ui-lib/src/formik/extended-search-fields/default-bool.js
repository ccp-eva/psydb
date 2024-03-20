import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { GenericMultiCheckbox } from './generic-multi-checkbox';

const options = {
    'true': 'Yes',
    'false': 'No',
}

export const DefaultBool = (ps) => {
    var translate = useUITranslation();
    return (
        <GenericMultiCheckbox
            options={ translate.options(options) }
            { ...ps }
        />
    )
}
