import React from 'react';
import { intersect } from '@mpieva/psydb-core-utils';
import { labMethods } from '@mpieva/psydb-schema-enums';
import { useUIConfig, useI18N } from '@mpieva/psydb-ui-contexts';
import { GenericEnum } from './generic-enum';

export const LabMethodKey = (ps) => {
    var { options, allowedValues, ...pass } = ps;

    var { enabledLabMethods } = useUIConfig();
    var [{ translate }] = useI18N();

    return (
        <GenericEnum
            { ...pass }
            options={ translate.options(labMethods.mapping) }
            allowedValues={
                allowedValues
                ? intersect(enabledLabMethods, allowedValues )
                : undefined
            }
        />
    )
}
