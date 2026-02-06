import React from 'react';
import { useUILanguage } from '@mpieva/psydb-ui-contexts';
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
    var {
        displayName,
        displayNameI18N = {}, // FIXME: in apedb this does not fall back
        type,
        props
    } = definition;

    var [ language ] = useUILanguage();

    type = fixSystemType(type);
    var isRequired = true;
    //console.log(type, props);
    switch (type) {
        case 'SaneString':
        case 'FullText':
        case 'Email':
            isRequired = props.minLength > 0;
            break;
        case 'ForeignId':
        case 'HelperSetItemId':
        case 'Integer':
        case 'DateTime':
        case 'DateOnlyServerSide':
            isRequired = !props.isNullable;
            break;
        case 'ForeignIdList':
        case 'HelperSetItemIdList':
        case 'EmailWithPrimaryList':
        case 'PhoneWithTypeList':
        case 'PhoneList':
        case 'SubjectTestingPermissionList':
        case 'URLStringList':
            isRequired = props.minItems > 0;
            break;
        case 'Address':
            isRequired = (
                props.isStreetRequired
                || props.isHousenumberRequired
                || props.isAffixRequired
                || props.isPostcodeRequired
                || props.isCityRequired
                || props.isCountryRequired
            );
            break;
    }

    var Component = Fields[type] || CustomFieldFallback;
    return (
        <Component
            dataXPath={ dataXPath }
            label={ displayNameI18N?.[language] || displayName }
            related={ related }
            required={ isRequired }
            extraContentWrapperProps={{ ...props, ...extraTypeProps[type] }}
            extraItemWrapperProps={{ ...props, ...extraTypeProps[type] }}
            { ...props }
            { ...extraTypeProps[type] }
        />
    )
}
