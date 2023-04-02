import React from 'react';
import { Fields, useFormikContext } from '@mpieva/psydb-ui-lib';
import {
    MinItemsProp,
    MinLengthProp,
    IsNullable,
    IsSpecialAgeFrameFieldProp,
    SetIdProp,
    SharedForeignIdProps,
} from './utility-fields';

export const SaneString = (ps) => {
    return (
        <>
            <MinLengthProp />
        </>
    )
}

export const FullText = (ps) => {
    return (
        <>
            <MinLengthProp />
        </>
    )
}

export const Integer = (ps) => {
    return (
        <>
            <Fields.Integer
                label='Minimum'
                dataXPath='$.props.props.minimum'
                required
            />
            <IsNullableProp />
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
            <IsSpecialAgeFrameFieldProp />
            <IsNullableProp />
        </>
    )
}
export const DateOnlyServerSide = (ps) => {
    return (
        <>
            <IsSpecialAgeFrameFieldProp />
            <IsNullableProp />
        </>
    )
}

export const HelperSetItemId = (ps) => {
    return (
        <>
            <SetIdProp />
            <IsNullableProp />
        </>
    )
}

export const HelperSetItemIdList = (ps) => {
    return (
        <>
            <SetIdProp />
            <MinItemsProp />
        </>
    )
}

export const ForeignId = (ps) => {
    return (
        <>
            <SharedForeignIdProps />
        </>
    )
}

export const ForeignIdList = (ps) => {
    return (
        <>
            <SharedForeignIdProps />
            <MinItemsProp />
        </>
    )
}

export const Address = (ps) => {
    return (
        <>
            <Fields.DefaultBool
                label='Straße ist Pflichtfeld'
                dataXPath='$.props.props.isStreetRequired'
                uiSplit={[ 6,6 ]}
            />
            <Fields.DefaultBool
                label='Hausnummer ist Pflichtfeld'
                dataXPath='$.props.props.isHousenumberRequired'
                uiSplit={[ 6,6 ]}
            />
            <Fields.DefaultBool
                label='Affix ist Pflichtfeld'
                dataXPath='$.props.props.isAffixRequired'
                uiSplit={[ 6,6 ]}
            />
            <Fields.DefaultBool
                label='PLZ ist Pflichtfeld'
                dataXPath='$.props.props.isPostcodeRequired'
                uiSplit={[ 6,6 ]}
            />
            <Fields.DefaultBool
                label='Stadt ist Pflichtfeld'
                dataXPath='$.props.props.isCityRequired'
                uiSplit={[ 6,6 ]}
            />
            <Fields.DefaultBool
                label='Land ist Pflichtfeld'
                dataXPath='$.props.props.isCountryRequired'
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
            <MinItemsProp />
        </>
    )
}

export const Phone = (ps) => {
    return null;
}

export const PhoneList = (ps) => {
    return (
        <>
            <MinItemsProp />
        </>
    )
}
export const PhoneWithTypeList = (ps) => {
    return (
        <>
            <MinItemsProp />
        </>
    )
}
