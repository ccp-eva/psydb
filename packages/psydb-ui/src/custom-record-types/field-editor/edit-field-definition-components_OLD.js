import React from 'react';
import { Fields, useFormikContext } from '@mpieva/psydb-ui-lib';

import {
    IsSpecialAgeFrameField,
    MinLength,
    MinItems,
    IsNullable,
    DisplayEmptyAsUnknown
} from './field-definition-utils';

export const SaneString = {
    defaults: { minLength: 0 },
    Component: (ps) => <MinLength />
}

export const SaneStringList = {
    defaults: { minItems: 0 },
    Component: (ps) => <MinItems />
}

export const FullText = {
    defaults: { minLength: 0 },
    Component: (ps) => <MinLength />
}

export const Integer = {
    defaults: { minimum: '', isNullable: false },
    Component: (ps) => <>
        <Fields.Integer
            label='Minimum'
            dataXPath='$.props.minimum'
        />
        <IsNullable />
    </>
}

export const ForeignId = {
    defaults: { isNullable: false, displayEmptyAsUnknown: false },
    Component: (ps) => {
        return (
            <>
                <IsNullable />
                <DisplayEmptyAsUnknown />
            </>
        )
    }
}



export const ForeignIdList = {
    defaults: { minItems: 0, readOnly: false },
    Component: (ps) => {
        return (
            <>
                <MinItems />
                <Fields.DefaultBool
                    dataXPath='$.props.readOnly'
                    label='Nur Lesen'
                />
            </>
        )
    }
}

export const HelperSetItemId = {
    defaults: { isNullable: false, displayEmptyAsUnknown: false },
    Component: (ps) => (
        <>
            <IsNullable />
            <DisplayEmptyAsUnknown />
        </>
    )
}

export const HelperSetItemIdList = {
    defaults: { minItems: 0 },
    Component: (ps) => <MinItems />
}

export const DateTime = {
    defaults: { isNullable: false },
    Component: (ps) => <IsNullable />
}

export const DateOnlyServerSide = {
    defaults: { isNullable: false },
    Component: (ps) => <IsNullable />
}

export const BiologicalGender = {
    defaults: { enableUnknownValue: false },
    Component: (ps) => (
        <Fields.DefaultBool
            label='mit "Unbekannt" Wert'
            dataXPath='$.props.enableUnknownValue'
        />
        <Fields.DefaultBool
            label='mit "Divers" Wert'
            dataXPath='$.props.enableOtherValue'
        />
    )
}


export const DefaultBool = {
    defaults: {},
    Component: (ps) => null
}

export const ExtBool = {
    defaults: {},
    Component: (ps) => null
}

export const Email = {
    defaults: {},
    Component: (ps) => null
}

export const EmailList = {
    defaults: { minItems: 0 },
    Component: (ps) => <MinItems />
}

export const Phone = {
    defaults: {},
    Component: (ps) => null
}

export const PhoneList = {
    defaults: { minItems: 0 },
    Component: (ps) => <MinItems />
}

export const PhoneWithTypeList = {
    defaults: { minItems: 0 },
    Component: (ps) => <MinItems />
}

export const Address = {
    defaults: {
        isStreetRequired: true,
        isHousenumberRequired: true,
        isAffixRequired: false,
        isPostcodeRequired: true,
        isCityRequired: true,
        isCountryRequired: true,
    },
    Component: (ps) => (
        [
            [ 'isStreetRequired', 'Strasse pflicht' ],
            [ 'isHousenumberRequired', 'Nummer pflicht' ],
            [ 'isAffixRequired', 'Affix pflicht' ],
            [ 'isPostcodeRequired', 'PLZ pflicht' ],
            [ 'isCityRequired', 'Stadt pflicht'],
            [ 'isCountryRequired', 'Land pflicht' ],
        ].map(([ key, label]) => (
            <Fields.DefaultBool
                key={ key }
                label={ label }
                dataXPath={ `$.props.${key}` }
            />
        ))
    )
}

export const GeoCoords = {
    defaults: {},
    Component: (ps) => null
}

export const URLStringList = {
    defaults: { minItems: 0 },
    Component: (ps) => <MinItems />
}

// TODO
export const ListOfObjects = {
    defaults: {},
    Component: (ps) => null
}



