import React from 'react';
import { CustomField } from './custom-field';
import { ListOfObjectsField } from './list-of-objects-field';

/*
    <Fields.Dynamic
        fieldDefinitions={ fieldDefinitions }
        subChannelKey='gdpr'
        related={ related }
        extraTypeProps={{
            'PhoneWithTypeList': { enableParentNumbers: true }
        }}
    />
*/

// TODO: make custom fields based on crt field list instead of schema
export const Custom = (ps) => {
    var {
        fieldDefinitions,
        subChannelKey,
        related,
        extraTypeProps = {},
    } = ps;

    var fields = (
        subChannelKey
        ? fieldDefinitions[subChannelKey]
        : fieldDefinitions
    );

    fields = fields.map(it => ({
        definition: it,
        dataXPath: (
            subChannelKey
            ? `$.${subChannelKey}.custom.${it.key}`
            : `$.custom.${it.key}`
        )
    }))
    //console.log(fields);

    return fields.map(it => {
        var { systemType } = it.definition;
        
        if (systemType === 'Lambda') {
            return null;
        }

        var Component = (
            systemType === 'ListOfObjects'
            ? ListOfObjectsField
            : CustomField
        )
        return (
            <Component
                key={ it.dataXPath }
                dataXPath={ it.dataXPath }
                definition={ it.definition }
                related={ related }
                extraTypeProps={ extraTypeProps }
            />
        )
    });
}
