import React from 'react';
import { keyBy } from '@mpieva/psydb-core-utils';
import { useThemeContext } from '../core/theme-context';
import * as Fields from './static';

import { CustomField } from './custom-field';

export const Custom = (ps) => {
    var { value, record, related, crtSettings, subChannelKey, onlyKeys } = ps;
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
                    record={ record }
                    related={ related }
                />
            ))}
        </>
    )
}
