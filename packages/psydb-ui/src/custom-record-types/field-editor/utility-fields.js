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

export const DisplayName = (ps) => {
    var { extraOnChange } = ps;
    return (
        <Fields.SaneString
            label='Anzeigename'
            dataXPath='$.props.displayName'
            extraOnChange={ extraOnChange }
            required
        />
    )
}

export const KeyAndDisplayName = () => {
    var { setFieldValue } = useFormikContext();

    return (
        <>
            <DisplayName extraOnChange={ (next) => {
                setFieldValue(
                    '$.props.key',
                    next.toLowerCase().replaceAll(/[^A-Za-z0-9]/g, '_')
                );
            }} />
            <Fields.SaneString
                label='Interner Key'
                dataXPath='$.props.key'
                required
            />
        </>
    )
}

export const MinItemsProp = () => {
    return (
        <Fields.Integer
            label='Mindestanzahl'
            dataXPath='$.props.props.minItems'
            min={ 0 }
        />
    )
}

export const MinLengthProp = () => {
    return (
        <Fields.Integer
            label='Zeichen (mindestens)'
            dataXPath='$.props.props.minLength'
            min={ 0 }
        />
    )
}

export const IsNullableProp = () => {
    return (
        <Fields.DefaultBool
            label='Optional'
            dataXPath='$.props.props.isNullable'
            required
        />
    )
}

export const IsSpecialAgeFrameFieldProp = () => {
    return (
        <Fields.DefaultBool
            label='Altersfenster-Referenz'
            dataXPath='$.props.props.isSpecialAgeFrameField'
        />
    )
}

export const SetIdProp = () => {
    return (
        <Fields.ForeignId
            label='Hilfs-Tabelle'
            collection='helperSet'
            dataXPath='$.props.props.setId'
        />
    )
}

export const SharedForeignIdProps = () => {
    var { values } = useFormikContext();
    return (
        <>
            <Fields.GenericEnum
                label='Haupt-Tabelle'
                dataXPath='$.props.props.collection'
                enum={ enums.customRecordTypeCollections }
                required
            />
            <Fields.SaneString
                label='Datensatz-Typ'
                dataXPath='$.props.props.recordType'
                disabled={ !values['$']?.props?.props?.collection }
                required
            />
        </>
    )
}
