import React from 'react';
import jsonpointer from 'jsonpointer';
import { keyBy } from '@mpieva/psydb-core-utils';
import { CustomField } from './custom-field';

export const createFullUserOrdered = (options) => (ps) => {
    var { extraFieldComponents = {} } = options;
    var { value, related, crtSettings  } = ps;

    var {
        hasSubChannels,
        formOrder,
        fieldDefinitions,
        staticFieldDefinitions
    } = crtSettings;

    var keyedFieldDefinitions = keyBy({
        items: (
            hasSubChannels
            ? Object.keys(fieldDefinitions).reduce(
                (acc, key) => ([ ...acc, ...fieldDefinitions[key]]),
                []
            )
            : fieldDefinitions
        ),
        byProp: 'pointer'
    });

    var keyedStaticFieldDefinitions = keyBy({
        items: staticFieldDefinitions,
        byProp: 'dataPointer' // dataPointer
    });

    var allDefinitions = {
        ...keyedFieldDefinitions,
        ...keyedStaticFieldDefinitions
    };

    return (
        <>
            { formOrder.map((pointer, ix) => {
                var def = allDefinitions[pointer];
                var { systemType, displayName } = def;
                
                var Extra = extraFieldComponents[systemType];
                var shared = {
                    key: ix,
                    value: jsonpointer.get(value, pointer),
                    related,
                };

                return (
                    Extra
                    ? <Extra { ...shared } label={ displayName } />
                    : <CustomField { ...shared } definition={ def } />
                )
            })}
        </>
    );
}
