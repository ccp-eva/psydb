import React from 'react';
import jsonpointer from 'jsonpointer';
import { keyBy } from '@mpieva/psydb-core-utils';
import { CustomField } from './custom-field';
import { ListOfObjectsField } from './list-of-objects-field';

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
        byProp: 'dataPointer' // FIXME
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

                if (Extra) {
                    return <Extra { ...shared } label={ displayName } />
                }
                else if (def.type === 'ListOfObjects') {
                    return (
                        <ListOfObjectsField
                            { ...shared }
                            definition={ def }
                        />
                    )
                }
                else {
                    return <CustomField { ...shared } definition={ def } />
                }
            })}
        </>
    );
}
