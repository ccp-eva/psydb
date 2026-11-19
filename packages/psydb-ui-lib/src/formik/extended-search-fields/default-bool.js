import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { GenericMultiCheckbox } from './generic-multi-checkbox';

const options = {
    'true': 'Yes',
    'false': 'No',
}

export const DefaultBool = (ps) => {
    var [{ translate }] = useI18N();
    return (
        <GenericMultiCheckbox
            options={ translate.options(options) }
            { ...ps }
        />
    )
}
