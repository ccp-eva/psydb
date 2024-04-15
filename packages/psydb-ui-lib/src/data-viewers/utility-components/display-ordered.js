import React from 'react';
import sift from 'sift';

import { jsonpointer } from '@mpieva/psydb-core-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { usePermissions } from '@mpieva/psydb-ui-hooks';

import { CustomField } from './custom-field';
import { ListOfObjectsField } from './list-of-objects-field';


export const createDisplayOrdered = (options) => (ps) => {
    var { displayFields, value, related } = ps;
    
    var permissions = usePermissions();
    var translate = useUITranslation();

    if (!permissions.hasFlag('canAccessSensitiveFields')) {
        displayFields = displayFields.filter(sift({
            'props.isSensitive': { $ne: true }
        }))
    }

    return displayFields.map((def, ix) => {
        var { systemType, pointer } = def;
        
        var shared = {
            key: ix,
            value: jsonpointer.get(value, pointer),
            record: value,
            related
        }

        if (def.systemType === 'ListOfObjects') {
            return <ListOfObjectsField { ...shared } definition={ def } />
        }
        else {
            return <CustomField { ...shared } definition={ def } />
        }
    })
}
