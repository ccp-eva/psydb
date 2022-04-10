import React from 'react';
import { CustomField } from './custom-field';

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
        extraTypeProps
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

    return fields.map(it => (
        <CustomField
            key={ it.dataXPath }
            dataXPath={ it.dataXPath }
            definition={ it.definition }
            related={ related }
            extraTypeProps={ extraTypeProps }
        />
    ));
}
