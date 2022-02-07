import React from 'react';
import * as Fields from './static';

/*
    <Fields.Custom
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
        dataXPath,
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
            dataXPath
            ? `${dataXPath}.${it.key}`
            : (
                subChannelKey
                ? `$.${subChannelKey}.custom.${it.key}`
                : `$.custom.${it.key}`
            )
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
    switch (systemType) {
        case 'PhoneList':
        case 'EmailList':
            return 'SaneString';

        case 'DateTime':
            'DateTimeInterval';

        case 'DateOnlyServerSide':
            return 'DateOnlyServerSideInterval';

        case 'Integer':
            return 'IntegerInterval';

        case 'HelperSetItemIdList':
        case 'HelperSetItemId':
            return 'NegatableHelperSetItemIdList';

        case 'ForeignIdList':
        case 'ForeignId':
            return 'NegatableForeignIdList';

        case 'SaneString':
        case 'BiologicalGender':
        case 'ExtBool':
        default:
            return systemType;
    }
};
const CustomField = (ps) => {
    var { dataXPath, definition, related, extraTypeProps = {} } = ps;
    var { displayName, type, props } = definition;

    type = fixSystemType(type);

    var Component = Fields[type] || CustomFieldFallback;
    return (
        <Component
            dataXPath={ dataXPath }
            label={ displayName }
            related={ related }
            required={ false }
            systemType={ type }
            { ...props }
            { ...extraTypeProps[type] }
        />
    )
}
