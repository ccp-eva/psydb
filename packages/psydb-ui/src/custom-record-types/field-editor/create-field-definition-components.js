import React from 'react';
import * as enums from '@mpieva/psydb-schema-enums';
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
    defaults: {
        collection: undefined,
        recordType: undefined,
        constraints: {},
        isNullable: false,
        displayEmptyAsUnknown: false,
        addReferenceToTarget: false,
        targetReferenceField: undefined
    },
    Component: (ps) => {
        var formik = useFormikContext();
        var { values } = formik;
        var {
            collection,
            recordType,
            addReferenceToTarget
        } = values['$'].props;

        return (
            <>
                <Fields.GenericEnum
                    dataXPath='$.props.collection'
                    label='Referenz-Tabelle'
                    required
                    enum={ enums.foreignIdFieldCollections }
                />
                <Fields.GenericTypeKey
                    collection={ collection }
                    dataXPath='$.props.recordType'
                    label='Datensatz-Typ'
                    required
                    disabled={ !collection }
                />
                <IsNullable />
                <DisplayEmptyAsUnknown />

                <Fields.DefaultBool
                    dataXPath='$.props.addReferenceToTarget'
                    label='Referenz in Ziel'
                />

                <Fields.CRTFieldPointer
                    collection={ collection }
                    recordType={ recordType }
                    dataXPath='$.props.targetReferenceField'
                    label='Ziel-Feld'
                    required
                    disabled={
                        !collection
                        || !recordType
                        || !addReferenceToTarget
                    }
                />
            </>
        )
    }
}



export const ForeignIdList = {
    defaults: {
        collection: undefined,
        recordType: undefined,
        constraints: {},
        minItems: 0,
        //addReferenceToTarget: false,
        //targetReferenceField: undefined,
        readOnly: false
    },
    Component: (ps) => {
        var formik = useFormikContext();
        var { values } = formik;
        var {
            collection,
            recordType,
            //addReferenceToTarget
        } = values['$'].props;

        return (
            <>
                <Fields.GenericEnum
                    dataXPath='$.props.collection'
                    label='Referenz-Tabelle'
                    required
                    enum={ enums.foreignIdFieldCollections }
                />
                <Fields.GenericTypeKey
                    collection={ collection }
                    dataXPath='$.props.recordType'
                    label='Datensatz-Typ'
                    required
                    disabled={ !collection }
                />
                <MinItems />

                <Fields.DefaultBool
                    dataXPath='$.props.readOnly'
                    label='Nur Lesen'
                />


                {/*<Fields.DefaultBool
                    dataXPath='$.props.displayEmptyAsUnknown'
                    label='Leer als "Unbekannt"'
                />

                <Fields.DefaultBool
                    dataXPath='$.props.addReferenceToTarget'
                    label='Referenz in Ziel'
                />

                <Fields.CRTFieldPointer
                    collection={ collection }
                    recordType={ recordType }
                    dataXPath='$.props.targetReferenceField'
                    label='Ziel-Feld'
                    required
                    disabled={
                        !collection
                        || !recordType
                        || !addReferenceToTarget
                    }
                />*/}
            </>
        )
    }
}

export const HelperSetItemId = {
    defaults: {
        setId: undefined,
        isNullable: false,
        displayEmptyAsUnknown: false,
    },
    Component: (ps) => {
        return (
            <>
                <Fields.HelperSetId
                    dataXPath='$.props.setId'
                    label='Hilfstabelle'
                    required
                />
                <IsNullable />
                <DisplayEmptyAsUnknown />
            </>
        )
    }
}

export const HelperSetItemIdList = {
    defaults: {
        setId: undefined,
        minItems: 0,
    },
    Component: (ps) => {
        return (
            <>
                <Fields.HelperSetId
                    dataXPath='$.props.setId'
                    label='Hilfstabelle'
                    required
                />
                <MinItems />
            </>
        )
    }
}

export const DateTime = {
    defaults: { isSpecialAgeFrameField: false, isNullable: false },
    Component: (ps) => (
        <>
            <IsSpecialAgeFrameField />
            <IsNullable />
        </>
    )
}

export const DateOnlyServerSide = {
    defaults: { isSpecialAgeFrameField: false, isNullable: false },
    Component: (ps) => (
        <>
            <IsSpecialAgeFrameField />
            <IsNullable />
        </>
    )
}

export const BiologicalGender = {
    defaults: { enableUnknownValue: false },
    Component: (ps) => (
        <Fields.DefaultBool
            label='mit "Unbekannt" Wert'
            dataXPath='$.props.enableUnknownValue'
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



