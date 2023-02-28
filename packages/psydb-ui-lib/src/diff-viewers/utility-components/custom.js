import React from 'react';
import { keyBy } from '@mpieva/psydb-core-utils';
import * as Fields from './static';

import { CustomField } from './custom-field';

export const Custom = (ps) => {
    var { value, related, crtSettings, subChannelKey, onlyKeys, diffKind } = ps;
    var { fieldDefinitions } = crtSettings;

    var fields = (
        subChannelKey
        ? fieldDefinitions[subChannelKey]
        : fieldDefinitions
    );

    if (!fields) {
        throw new Error('no fields found, maybe missing subChannelKey')
    }
    var fieldsByKey = keyBy({
        items: fields,
        byProp: 'key',
    });

    var keys = onlyKeys || Object.keys(fieldsByKey);
    return (
        <>
            { keys.map((k, ix) => (
                <CustomField
                    key={ ix }
                    definition={ fieldsByKey[k] }
                    value={ value[k] }
                    related={ related }
                    diffKind={ diffKind }
                />
            ))}
        </>
    )
}
