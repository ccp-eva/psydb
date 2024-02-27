import React from 'react';
import { keyBy, jsonpointer, entries } from '@mpieva/psydb-core-utils';
import { usePermissions } from '@mpieva/psydb-ui-hooks';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { CustomField } from './custom-field';
import { ListOfObjectsField } from './list-of-objects-field';

export const createFullUserOrdered = (options) => (ps) => {
    var { extraFieldComponents = {} } = options;
    var { value, related, crtSettings, exclude = []  } = ps;

    var permissions = usePermissions();
    var translate = useUITranslation();

    var {
        hasSubChannels,
        formOrder,
        fieldDefinitions,
        staticFieldDefinitions
    } = crtSettings;

    var allowedFieldDefs = (
        hasSubChannels
        ? Object.keys(fieldDefinitions).reduce(
            (acc, key) => ([ ...acc, ...fieldDefinitions[key]]),
            []
        )
        : fieldDefinitions
    ).filter(it => {
        if (!permissions.hasFlag('canAccessSensitiveFields')) {
            if (it.props?.isSensitive) {
                return false;
            }
        }
        return true;
    });

    var keyedFieldDefinitions = keyBy({
        items: allowedFieldDefs,
        byProp: 'pointer'
    });

    var keyedStaticFieldDefinitions = keyBy({
        items: staticFieldDefinitions.map(it => ({
            ...it, displayName: translate(it.displayName)
        })),
        byProp: 'dataPointer' // FIXME
    });

    var allDefinitions = {
        ...keyedFieldDefinitions,
        ...keyedStaticFieldDefinitions
    };

    formOrder = formOrder.filter(it => (
        !exclude.includes(it)
    ));

    return (
        <>
            { formOrder.map((pointer, ix) => {
                var def = allDefinitions[pointer];
                if (!def) {
                    return null;
                }
                var { systemType, displayName } = def;
                
                var Extra = extraFieldComponents[systemType];
                var shared = {
                    key: ix,
                    value: jsonpointer.get(value, pointer),
                    record: value,
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
