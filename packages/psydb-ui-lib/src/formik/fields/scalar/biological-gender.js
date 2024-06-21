import React from 'react';
import { omit } from '@mpieva/psydb-core-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { GenericEnum } from './generic-enum';

export const BiologicalGender = (ps) => {
    var { enableUnknownValue, enableOtherValue } = ps;
    var translate = useUITranslation();

    var options = {
        'male': 'Male',
        'female': 'Female',
        'other': 'Other',
        'unknown': 'Unknown',
    }

    var omissions = [];
    if (!enableUnknownValue) {
        omissions.push('unknown');
    }
    if (!enableOtherValue) {
        omissions.push('other');
    }
    if (omissions.length > 0) {
        options = omit({ from: options, paths: omissions });
    }

    return (
        <GenericEnum
            options={ translate.options(options) }
            { ...ps }
        />
    )
}
