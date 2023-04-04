import React from 'react';
import * as enums from '@mpieva/psydb-schema-enums';
import { Fields, useFormikContext } from '@mpieva/psydb-ui-lib';
import getFieldValue from './get-field-value';

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
        <Fields.HelperSetId
            label='Hilfs-Tabelle'
            dataXPath={ `${dataXPath}.props.setId` }
            disabled={ !isUnrestricted }
            required
        />
    )
}

export const SharedForeignIdProps = (ps) => {
    var { dataXPath, isUnrestricted } = ps;
    var { values } = useFormikContext();
    var { collection } = getFieldValue(values, `${dataXPath}.props`);

    return (
        <>
            <Fields.GenericEnum
                label='Haupt-Tabelle'
                dataXPath={ `${dataXPath}.props.collection` }
                //enum={ enums.customRecordTypeCollections }
                enum={ enums.foreignIdFieldCollections }
                disabled={ !isUnrestricted }
                required
            />
            <Fields.GenericTypeKey
                label='Datensatz-Typ'
                collection={ collection }
                dataXPath={ `${dataXPath}.props.recordType` }
                disabled={ !isUnrestricted || !collection }
                required
            />
            {/*<Fields.SaneString
                label='Datensatz-Typ'
                dataXPath={ `${dataXPath}.props.recordType` }
                disabled={ !isUnrestricted }
                required
            />*/}
        </>
    )
}
