import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { GenericEnum } from './generic-enum';

export const LogicGate = (ps) => {
    var [{ translate }] = useI18N();

    var options = {
        'and': '_logicGate_and',
        'or': '_logicGate_or',
    }

    return (
        <GenericEnum
            options={ translate.options(options) }
            { ...ps }
        />
    )
}
