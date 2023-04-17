import React from 'react';
import { Fields, useFormikContext } from '@mpieva/psydb-ui-lib';
import {
    MinItemsProp,
    MinLengthProp,
    IsNullableProp,
    IsSpecialAgeFrameFieldProp,
    SetIdProp,
    SharedForeignIdProps,
} from './utility-fields';

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
    return (
        <>
            <SharedForeignIdProps { ...ps } />
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
