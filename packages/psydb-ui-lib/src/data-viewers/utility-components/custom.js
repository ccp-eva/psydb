import React from 'react';
import { keyBy } from '@mpieva/psydb-core-utils';
import * as Fields from './static';

export const Custom = (ps) => {
    var { value, related, crtSettings, subChannelKey, onlyKeys } = ps;
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
            { keys.map(k => (
                <CustomField
                    definition={ fieldsByKey[k] }
                    value={ value[k] }
                    related={ related }
                />
            ))}
        </>
    )
}

const CustomFieldFallback = (ps) => {
    var { pointer, type } = ps;
    return (
        <div className='text-danger'>{ pointer }: { type } }</div>
    )
}

const fixSystemType = (systemType) => {
    // TODO: make sure that we dont need this mapping anymore
    switch (systemType) {
        case 'EmailList':
            return 'EmailWithPrimaryList';
        case 'PhoneList':
            return 'PhoneWithTypeList';
        default:
            return systemType;
    }
};
var CustomField = (ps) => {
    var { definition, value, related } = ps;
    var { displayName, type, props } = definition;

    type = fixSystemType(type);
    var Component = Fields[type];

    if (!Component) {
        return (
            <CustomFieldFallback
                type={ type }
                pointer={ definition.pointer }
            />
        );
    }

    // FIXME: theming
    return (
        <div className='mb-3'>
            <header><b>{ displayName}</b></header>
            <Component
                value={ value }
                props={ props }
                related={ related }
            />
        </div>
    )
}
