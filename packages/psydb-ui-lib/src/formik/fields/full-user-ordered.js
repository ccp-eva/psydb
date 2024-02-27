import React from 'react';
import {
    keyBy,
    without,
    convertPointerToPath
} from '@mpieva/psydb-core-utils';

import { usePermissions } from '@mpieva/psydb-ui-hooks';

import { CustomField } from './custom-field';
import { ListOfObjectsField } from './list-of-objects-field';


export const FullUserOrdered = (ps) => {
    var { related, crtSettings, extraTypeProps, exclude = [] } = ps; 

    var permissions = usePermissions();

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
        items: staticFieldDefinitions,
        byProp: 'dataPointer' // FIXME
    });

    var allDefinitions = {
        ...keyedFieldDefinitions,
        ...keyedStaticFieldDefinitions
    };

    return (
        <>
            { without(formOrder, exclude).map((pointer, ix) => {
                var def = allDefinitions[pointer];
                if (!def) {
                    return null;
                }
                // FIXME: we maybe can get rid this replace
                var fixedPointer = pointer.replace('/state', '');
                var dataXPath = (
                    '$.' + convertPointerToPath(fixedPointer)
                );

                if (def.type === 'Lambda') {
                    return null;
                }

                var Component = (
                    def.type === 'ListOfObjects'
                    ? ListOfObjectsField
                    : CustomField
                )
                return (
                    <Component
                        key={ dataXPath }
                        dataXPath={ dataXPath }
                        definition={ def }
                        related={ related }
                        extraTypeProps={ extraTypeProps }
                    />
                )
            })}
        </>
    );
}
