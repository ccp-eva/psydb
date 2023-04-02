import React from 'react';
import { entries } from '@mpieva/psydb-core-utils';
import { Fields, useFormikContext } from '@mpieva/psydb-ui-lib';
import { DisplayName, KeyAndDisplayName } from './utility-fields';

const CoreDefinitions = (ps) => {
    var { enableInternalKey } = ps;
    var { setFieldValue } = useFormikContext();
    return (
        <>
            <Fields.GenericEnum
                label='Feld-Typ'
                dataXPath='$.props.type'
                options={ fieldtypes }
                extraOnChange={ (next) => {
                    setFieldValue('$.props.props', {})
                }}
                required
            />
            <hr />
            { enableInternalKey ? (
                <KeyAndDisplayName />
            ) : (
                <DisplayName />
            )}
            <hr />
        </>
    )
}

const fieldtypes = entries({
    'SaneString': 'Freitext einzelig',
    'FullText': 'Freitext mehrzeilig',
    
    'Integer': 'Ganz-Zahl',
    'DefaultBool': 'Ja/Nein-Wert',
    'ExtBool': 'Ja/Nein/Unbekannt-Wert',
    
    'DateTime': 'Datum + Zeit',
    'DateOnlyServerSide': 'Datum mit Server-Zeitzone',

    'HelperSetItemId': 'Eintrag aus Hilfs-Tabelle',
    'HelperSetItemIdList': 'Liste von Einträgen aus Hilfs-Tabelle',
    'ForeignId': 'Eintrag aus anderer Haupt-Tabellen',
    'ForeignIdList': 'Liste von Einträgen aus anderer Haupt-Tabellen',
    
    'Address': 'Adresse',
    'GeoCoords': 'Geo-Koordinaten',
    'BiologicalGender': 'Geschlecht',

    'Email': 'Email-Adresse',
    'EmailList': 'Liste von Email-Adressen',
    'Phone': 'Telefonnummer',
    'PhoneList': 'Liste von Telefon-Nummern ohne Typ',
    'PhoneWithTypeList': 'Liste von Telefon-Nummern mit Typ',

    //'ListOfObjects': 'Benutzerdefinierte Unterliste',
}).sort(([keyA], [keyB]) => (
    keyA < keyB ? -1 : 1
)).reduce((acc, [ key, value ]) => ({
    ...acc,
    [key]: `${key} - ${value}`
}), {});

export default CoreDefinitions;
