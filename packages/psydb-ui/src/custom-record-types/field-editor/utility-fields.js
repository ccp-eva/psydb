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
    var { dataXPath, extraOnChange } = ps;
    return (
        <Fields.SaneString
            label='Anzeigename'
            dataXPath={ `${dataXPath}.displayName` }
            extraOnChange={ extraOnChange }
            required
        />
    )
}

export const KeyAndDisplayName = (ps) => {
    var { dataXPath } = ps;
    var { setFieldValue } = useFormikContext();

    return (
        <>
            <DisplayName
                dataXPath={ dataXPath }
                extraOnChange={ (next) => setFieldValue(
                    `${dataXPath}.key`,
                    next.toLowerCase().replaceAll(/[^A-Za-z0-9]/g, '_')
                )}
            />
            <Fields.SaneString
                label='Interner Key'
                dataXPath={ `${dataXPath}.key` }
                required
            />
        </>
    )
}

export const MinItemsProp = (ps) => {
    var { dataXPath } = ps;
    return (
        <Fields.Integer
            label='Mindestanzahl'
            dataXPath={ `${dataXPath}.props.minItems` }
            min={ 0 }
        />
    )
}

export const MinLengthProp = (ps) => {
    var { dataXPath } = ps;
    return (
        <Fields.Integer
            label='Zeichen (mindestens)'
            dataXPath={ `${dataXPath}.props.minLength` }
            min={ 0 }
        />
    )
}

export const IsNullableProp = (ps) => {
    var { dataXPath } = ps;
    return (
        <Fields.DefaultBool
            label='Optional'
            dataXPath={ `${dataXPath}.props.isNullable` }
            required
        />
    )
}

export const IsSpecialAgeFrameFieldProp = (ps) => {
    var { dataXPath } = ps;
    return (
        <Fields.DefaultBool
            label='Altersfenster-Referenz'
            dataXPath={ `${dataXPath}.props.isSpecialAgeFrameField` }
            required
        />
    )
}

export const SetIdProp = (ps) => {
    var { dataXPath } = ps;
    return (
        <Fields.ForeignId
            label='Hilfs-Tabelle'
            collection='helperSet'
            dataXPath={ `${dataXPath}.props.setId` }
            required
        />
    )
}

export const SharedForeignIdProps = (ps) => {
    var { dataXPath } = ps;
    var { values } = useFormikContext();
    return (
        <>
            <Fields.GenericEnum
                label='Haupt-Tabelle'
                dataXPath={ `${dataXPath}.props.collection` }
                enum={ enums.customRecordTypeCollections }
                required
            />
            <Fields.SaneString
                label='Datensatz-Typ'
                dataXPath={ `${dataXPath}.props.recordType` }
                disabled={ !values['$']?.props?.props?.collection }
                required
            />
        </>
    )
}
