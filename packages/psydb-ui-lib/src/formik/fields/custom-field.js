import React from 'react';
import * as Fields from './static';

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
        case 'TestingPermissions':
            return 'SubjectTestingPermissionList';
        default:
            return systemType;
    }
};

export const CustomField = (ps) => {
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
