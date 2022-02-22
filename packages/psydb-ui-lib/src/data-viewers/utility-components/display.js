import React from 'react';
import jsonpointer from 'jsonpointer';
import { keyBy } from '@mpieva/psydb-core-utils';
import { useThemeContext } from '../core/theme-context';
import * as Fields from './static';

export const Display = (ps) => {
    var { value, related, crtSettings, onlyPointers } = ps;
    var {
        hasSubChannels,
        fieldDefinitions,
        staticFieldDefinitions = []
    } = crtSettings;

    var fields = (
        hasSubChannels
        ? (
            Object.keys(fieldDefinitions).reduce((acc, key) => ([
                ...acc, ...fieldDefinitions[key]
            ]), [])
        )
        : fieldDefinitions
    );

    if (!fields) {
        throw new Error('no fields defined in CRT')
    }

    fields = [ ...fields, ...staticFieldDefinitions ];

    var fieldsByPointer = keyBy({
        items: fields,
        byProp: 'pointer',
    });

    var pointers = onlyPointers || Object.keys(fieldsByPointers);
    return (
        <>
            { pointers.map((p, ix) => (
                <DisplayField
                    key={ ix }
                    definition={ fieldsByPointer[p] }
                    value={ jsonpointer.get(value, p) }
                    related={ related }
                />
            ))}
        </>
    )
}

const DisplayFieldFallback = (ps) => {
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
var DisplayField = (ps) => {
    var { definition, value, related } = ps;
    var { displayName, type, props } = definition;

    type = fixSystemType(type);
    var Component = Fields[type];

    var context = useThemeContext();
    var { Field } = context;

    if (!Component) {
        return (
            <DisplayFieldFallback
                type={ type }
                pointer={ definition.pointer }
            />
        );
    }

    return (
        <Field label={ displayName }>
            <Component
                value={ value }
                props={ props }
                related={ related }
            />
        </Field>
    )

}
