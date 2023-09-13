import React from 'react';
import { labMethods } from '@mpieva/psydb-schema-enums';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { GenericEnum } from './generic-enum';

export const LabMethodKey = (ps) => {
    var translate = useUITranslation();
    return (
        <GenericEnum
            options={ translate.options(labMethods.mapping) }
            { ...ps }
        />
    )
}
