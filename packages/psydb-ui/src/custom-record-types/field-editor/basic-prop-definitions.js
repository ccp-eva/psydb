import React from 'react';
import { Fields, useFormikContext } from '@mpieva/psydb-ui-lib';
import {
    MinItemsProp,
    MinLengthProp,
    IsNullableProp,
    IsSpecialAgeFrameFieldProp,
    SetIdProp,
    SharedForeignIdProps,
    DisplayEmptyAsUnknownProp,
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
        </>
    )
}

export const Integer = (ps) => {
    var { dataXPath, isUnrestricted } = ps;
    return (
        <>
            <Fields.Integer
                label='Minimum'
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
                label='Referenz in Ziel'
                dataXPath={ `${dataXPath}.props.addReferenceToTarget` }
                disabled={ !isUnrestricted }
            />

            <Fields.CRTFieldPointer
                label='Ziel-Feld'
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
    return (
        <>
            <Fields.DefaultBool
                label='Straße ist Pflichtfeld'
                dataXPath={ `${dataXPath}.props.isStreetRequired` }
                disabled={ !isUnrestricted }
                uiSplit={[ 6,6 ]}
            />
            <Fields.DefaultBool
                label='Hausnummer ist Pflichtfeld'
                dataXPath={ `${dataXPath}.props.isHousenumberRequired` }
                disabled={ !isUnrestricted }
                uiSplit={[ 6,6 ]}
            />
            <Fields.DefaultBool
                label='Affix ist Pflichtfeld'
                dataXPath={ `${dataXPath}.props.isAffixRequired` }
                disabled={ !isUnrestricted }
                uiSplit={[ 6,6 ]}
            />
            <Fields.DefaultBool
                label='PLZ ist Pflichtfeld'
                dataXPath={ `${dataXPath}.props.isPostcodeRequired` }
                disabled={ !isUnrestricted }
                uiSplit={[ 6,6 ]}
            />
            <Fields.DefaultBool
                label='Stadt ist Pflichtfeld'
                dataXPath={ `${dataXPath}.props.isCityRequired` }
                disabled={ !isUnrestricted }
                uiSplit={[ 6,6 ]}
            />
            <Fields.DefaultBool
                label='Land ist Pflichtfeld'
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
    return null;
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
    return (
        <>
            <Fields.GenericEnum
                label='Funktion'
                dataXPath={ `${dataXPath}.props.fn` }
                options={{
                    'deltaYMD': 'Altersberechnung'
                }}
                disabled={ !isUnrestricted }
                required
            />
            <Fields.SaneString
                label='Input'
                dataXPath={ `${dataXPath}.props.input` }
                disabled={ !isUnrestricted }
                required
            />
        </>
    )
}

