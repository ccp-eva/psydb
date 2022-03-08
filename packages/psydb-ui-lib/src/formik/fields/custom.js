import React from 'react';
import * as Fields from './static';

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

const CustomFieldFallback = (ps) => {
    var { dataXPath, systemType } = ps;
    return (
        <div className='text-danger'>{ dataXPath }: { systemType } }</div>
    )
}
const fixSystemType = (systemType) => {
    // TODO: make sure that we dont need this mapping anymore
    switch (systemType) {
        case 'EmailList':
            return 'EmailWithPrimaryList';
        default:
            return systemType;
    }
};
const CustomField = (ps) => {
    var { dataXPath, definition, related, extraTypeProps } = ps;
    var { displayName, type, props } = definition;

    type = fixSystemType(type);
    var isRequired = true;
    switch (type) {
        case 'SaneString':
        case 'FullText':
            isRequired = props.minLength > 0
            break;
        case 'ForeignId':
        case 'HelperSetItemId':
            isRequired = !props.isNullable;
            break;
        case 'Address':
            // TODO: depends on sub field prop settings
            isRequired = false;
            break;
    }

    var Component = Fields[type] || CustomFieldFallback;
    return (
        <Component
            dataXPath={ dataXPath }
            label={ displayName }
            related={ related }
            required={ isRequired }
            { ...props }
            { ...extraTypeProps[type] }
        />
    )
}
