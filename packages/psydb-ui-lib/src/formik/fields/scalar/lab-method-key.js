import React from 'react';
import { intersect } from '@mpieva/psydb-core-utils';
import enums from '@mpieva/psydb-schema-enums';
import { useUIConfig, useI18N } from '@mpieva/psydb-ui-contexts';
import { GenericEnum } from './generic-enum';

export const LabMethodKey = (ps) => {
    var { options, allowedValues, ...pass } = ps;

    var { enabledLabMethods } = useUIConfig();
    var [{ translate }] = useI18N();

    allowedValues = (
        allowedValues
        ? intersect(enabledLabMethods, allowedValues )
        : enabledLabMethods
    );

    return (
        <GenericEnum
            { ...pass }
            options={ translate.options(
                enums.labMethods.mapping
            )}
            allowedValues={ allowedValues }
        />
    )
}
