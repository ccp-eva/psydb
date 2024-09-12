import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { GenericEnum } from './generic-enum';

export const LogicGate = (ps) => {
    var translate = useUITranslation();

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
