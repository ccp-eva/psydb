import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { Fields, useFormikContext } from '@mpieva/psydb-ui-lib';
import {
    MinItemsProp,
    MinLengthProp,
    IsNullableProp,
    IsSpecialAgeFrameFieldProp,
    SetIdProp,
    SharedForeignIdProps,
    DisplayEmptyAsUnknownProp,
    IsSensitiveProp,
    EnableUnknownValueProp
} from './utility-fields';

import getFieldValue from './get-field-value';


export const SaneString = (ps) => {
    return (
        <>
            <MinLengthProp { ...ps } />
        </>
    )
}

export const FullText = (ps) => {
    return (
        <>
            <MinLengthProp { ...ps } />
            <IsSensitiveProp { ...ps } />
        </>
    )
}

export const Integer = (ps) => {
    var { dataXPath, isUnrestricted } = ps;
    var translate = useUITranslation();
    return (
        <>
            <Fields.Integer
                label={ translate('Minimum') }
                dataXPath={ `${dataXPath}.props.minimum` }
                disabled={ !isUnrestricted }
                required
            />
            <IsNullableProp { ...ps } />
        </>
    )
}
export const DefaultBool = (ps) => {
    return null
}
export const ExtBool = (ps) => {
    return null
}

export const DateTime = (ps) => {
    return (
        <>
            <IsSpecialAgeFrameFieldProp { ...ps } />
            <IsNullableProp { ...ps } />
        </>
    )
}
export const DateOnlyServerSide = (ps) => {
    return (
        <>
            <IsSpecialAgeFrameFieldProp { ...ps } />
            <IsNullableProp { ...ps } />
        </>
    )
}

export const HelperSetItemId = (ps) => {
    return (
        <>
            <SetIdProp { ...ps } />
            <IsNullableProp { ...ps } />
            <DisplayEmptyAsUnknownProp { ...ps } />
        </>
    )
}

export const HelperSetItemIdList = (ps) => {
    return (
        <>
            <SetIdProp { ...ps } />
            <MinItemsProp { ...ps } />
        </>
    )
}

export const ForeignId = (ps) => {
    var { dataXPath, isUnrestricted } = ps;
    
    var translate = useUITranslation();
    var { values } = useFormikContext();
    
    var {
        collection,
        recordType,
        addReferenceToTarget
    } = getFieldValue(values, `${dataXPath}.props`);

    console.log(collection, recordType, addReferenceToTarget)

    return (
        <>
            <SharedForeignIdProps { ...ps } />
            <DisplayEmptyAsUnknownProp { ...ps } />

            <Fields.DefaultBool
                label={ translate('Reference in Target') }
                dataXPath={ `${dataXPath}.props.addReferenceToTarget` }
                disabled={ !isUnrestricted }
            />

            <Fields.CRTFieldPointer
                label={ translate('Target Field') }
                collection={ collection }
                recordType={ recordType }
                dataXPath={ `${dataXPath}.props.targetReferenceField` }
                required
                disabled={
                    !collection
                    || !recordType
                    || !addReferenceToTarget
                }
            />
            <IsNullableProp { ...ps } />
        </>
    )
}

export const ForeignIdList = (ps) => {
    return (
        <>
            <SharedForeignIdProps { ...ps } />
            <MinItemsProp { ...ps } />
        </>
    )
}

export const Address = (ps) => {
    var { dataXPath, isUnrestricted } = ps;
    var translate = useUITranslation();
    return (
        <>
            <Fields.DefaultBool
                label={ translate('Street Is Required') }
                dataXPath={ `${dataXPath}.props.isStreetRequired` }
                disabled={ !isUnrestricted }
                uiSplit={[ 6,6 ]}
            />
            <Fields.DefaultBool
                label={ translate('Housenumber Is Required') }
                dataXPath={ `${dataXPath}.props.isHousenumberRequired` }
                disabled={ !isUnrestricted }
                uiSplit={[ 6,6 ]}
            />
            <Fields.DefaultBool
                label={ translate('Affix Is Required') }
                dataXPath={ `${dataXPath}.props.isAffixRequired` }
                disabled={ !isUnrestricted }
                uiSplit={[ 6,6 ]}
            />
            <Fields.DefaultBool
                label={ translate('Postcode Is Required') }
                dataXPath={ `${dataXPath}.props.isPostcodeRequired` }
                disabled={ !isUnrestricted }
                uiSplit={[ 6,6 ]}
            />
            <Fields.DefaultBool
                label={ translate('City Is Required') }
                dataXPath={ `${dataXPath}.props.isCityRequired` }
                disabled={ !isUnrestricted }
                uiSplit={[ 6,6 ]}
            />
            <Fields.DefaultBool
                label={ translate('Country Is Required') }
                disabled={ !isUnrestricted }
                dataXPath={ `${dataXPath}.props.isCountryRequired` }
                uiSplit={[ 6,6 ]}
            />
        </>
    )
}
export const GeoCoords = (ps) => {
    return null;
}

export const BiologicalGender = (ps) => {
    var { dataXPath, isUnrestricted } = ps;
    var translate = useUITranslation();

    return (
        <>
            <EnableUnknownValueProp { ...ps } />
            <Fields.DefaultBool
                label={ translate('Enable "Other" Value') }
                dataXPath={ `${dataXPath}.props.enableOtherValue` }
                disabled={ !isUnrestricted }
                required
            />
        </>
    )
}

export const Email = (ps) => {
    return null;
}

export const EmailList = (ps) => {
    return (
        <>
            <MinItemsProp { ...ps } />
        </>
    )
}

export const Phone = (ps) => {
    return null;
}

export const PhoneList = (ps) => {
    return (
        <>
            <MinItemsProp { ...ps } />
        </>
    )
}
export const PhoneWithTypeList = (ps) => {
    return (
        <>
            <MinItemsProp { ...ps } />
        </>
    )
}

export const Lambda = (ps) => {
    var { dataXPath, isUnrestricted } = ps;
    var translate = useUITranslation();
    return (
        <>
            <Fields.GenericEnum
                label={ translate('_lambda_function') }
                dataXPath={ `${dataXPath}.props.fn` }
                options={translate.options({
                    'deltaYMD': '_lambda_function_deltaYMD'
                })}
                disabled={ !isUnrestricted }
                required
            />
            <Fields.SaneString
                label={ translate('_lambda_input') }
                dataXPath={ `${dataXPath}.props.input` }
                disabled={ !isUnrestricted }
                required
            />
        </>
    )
}

