import React from 'react';
import * as enums from '@mpieva/psydb-schema-enums';
import { Fields, useFormikContext } from '@mpieva/psydb-ui-lib';

export const SubChannelKey = (ps) => {
    return (
        <Fields.GenericEnum
            label='Daten-Kanal'
            dataXPath='$.subChannelKey'
            options={{
                'scientific': 'Normal',
                'gdpr': 'Datenschutz',
            }}
            required
        />
    )
}

export const KeyAndDisplayName = (ps) => {
    var { dataXPath, isUnrestricted } = ps;
    var { setFieldValue } = useFormikContext();

    return (
        <>
            <Fields.SaneString
                label='Anzeigename'
                dataXPath={ `${dataXPath}.displayName` }
                extraOnChange={ (next) => setFieldValue(
                    `${dataXPath}.key`,
                    next.toLowerCase().replaceAll(/[^A-Za-z0-9]/g, '_')
                )}
                required
            />
            <Fields.SaneString
                label='Interner Key'
                dataXPath={ `${dataXPath}.key` }
                disabled={ !isUnrestricted }
                required
            />
        </>
    )
}

export const MinItemsProp = (ps) => {
    var { dataXPath, isUnrestricted } = ps;
    return (
        <Fields.Integer
            label='Mindestanzahl'
            dataXPath={ `${dataXPath}.props.minItems` }
            disabled={ !isUnrestricted }
            required
            min={ 0 }
        />
    )
}

export const MinLengthProp = (ps) => {
    var { dataXPath, isUnrestricted } = ps;
    return (
        <Fields.Integer
            label='Zeichen (mindestens)'
            dataXPath={ `${dataXPath}.props.minLength` }
            disabled={ !isUnrestricted }
            required
            min={ 0 }
        />
    )
}

export const IsNullableProp = (ps) => {
    var { dataXPath, isUnrestricted } = ps;
    return (
        <Fields.DefaultBool
            label='Optional'
            dataXPath={ `${dataXPath}.props.isNullable` }
            disabled={ !isUnrestricted }
            required
        />
    )
}

export const IsSpecialAgeFrameFieldProp = (ps) => {
    var { dataXPath, isUnrestricted } = ps;
    return (
        <Fields.DefaultBool
            label='Altersfenster-Referenz'
            dataXPath={ `${dataXPath}.props.isSpecialAgeFrameField` }
            disabled={ !isUnrestricted }
            required
        />
    )
}

export const SetIdProp = (ps) => {
    var { dataXPath, isUnrestricted } = ps;
    return (
        <Fields.ForeignId
            label='Hilfs-Tabelle'
            collection='helperSet'
            dataXPath={ `${dataXPath}.props.setId` }
            disabled={ !isUnrestricted }
            required
        />
    )
}

export const SharedForeignIdProps = (ps) => {
    var { dataXPath, isUnrestricted } = ps;
    var { values } = useFormikContext();
    return (
        <>
            <Fields.GenericEnum
                label='Haupt-Tabelle'
                dataXPath={ `${dataXPath}.props.collection` }
                enum={ enums.customRecordTypeCollections }
                disabled={ !isUnrestricted }
                required
            />
            <Fields.SaneString
                label='Datensatz-Typ'
                dataXPath={ `${dataXPath}.props.recordType` }
                disabled={ !values['$']?.props?.props?.collection }
                disabled={ !isUnrestricted }
                required
            />
        </>
    )
}
