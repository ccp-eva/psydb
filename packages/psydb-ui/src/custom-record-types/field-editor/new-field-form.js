import React, { useState, useEffect } from 'react';
import * as enums from '@mpieva/psydb-schema-enums';

import { entries } from '@mpieva/psydb-core-utils';
import { Button, Alert } from '@mpieva/psydb-ui-layout';

import { withTheme } from '@mpieva/rjsf-monkey-patch';
import { RJSFCustomTheme } from '@mpieva/psydb-ui-lib';

import {
    DefaultForm,
    Fields,
    FormBox,
    useFormikContext,
} from '@mpieva/psydb-ui-lib';

import agent from '@mpieva/psydb-ui-request-agents';
import FieldDefinitionSchemas from '@mpieva/psydb-common-lib/src/field-definition-schemas';

var createSchema = ({ hasSubChannels }) => ({
    type: 'object',
    properties: {
        ...(hasSubChannels && {
            subChannelKey: {
                title: 'Daten-Kanal',
                enum: ['scientific', 'gdpr'],
                enumNames: [ 'Normal', 'Datenschutz' ] 
            }
        }),
        fieldData: {
            type: 'object',
            title: 'Feld-Typ',
            /*oneOf: [
                FieldDefinitionSchemas.SaneString(),
                FieldDefinitionSchemas.BiologicalGender(),
            ]*/
            oneOf: Object.values(FieldDefinitionSchemas).map(f => {
                var fieldSchema = f();
                delete fieldSchema.properties.key;
                fieldSchema.required = (
                    fieldSchema.required.filter(it => it !== 'key')
                );
                console.log(fieldSchema);
                return fieldSchema;
            }).sort((a, b) => (a.title < b.title ? -1 : 1)),

        },
    },
});

var uiSchema = {
    'type': {
        // FIXME: there are some margins still left unfortunately
        // https://github.com/rjsf-team/react-jsonschema-form/pull/2175
        'ui:widget': 'hidden'
    }
}

var SchemaForm = withTheme(RJSFCustomTheme);

const NewFieldForm = ({ record, onSuccess }) => {
    var hasSubChannels = false;
    if (record.state.settings.subChannelFields) {
        hasSubChannels = true;
    }

    var schema = createSchema({ hasSubChannels });
    console.log(schema);

    var onSubmit = ({ formData, ...unused }) => {
        var { subChannelKey, fieldData } = formData;
        var message = {
            type: 'custom-record-types/add-field-definition',
            payload: {
                id: record._id,
                lastKnownEventId: record._lastKnownEventId,
                ...(hasSubChannels && ({ subChannelKey })),
                props: {
                    ...fieldData,
                    key: (
                        (String(fieldData.displayName) || '')
                        .toLowerCase().replaceAll(/[^A-Za-z0-9]/g, '_')
                    ),
                }
            }
        }
        return (
            agent.send({ message })
            .then(
                (response) => {
                    console.log(response);
                    onSuccess();
                },
                (error) => {
                    console.log('ERR:', error)
                    alert('TODO')
                }
            )
        )
    };
    return (
        <div>
            <SchemaForm
                noHtml5Validate={ true }
                showErrorList={ false }
                schema={ schema }
                uiSchema={ uiSchema }
                onSubmit={ onSubmit }
                formData={{
                    // FIXME: to prevent wierd rjsf behavior
                    // and default doesnt work for object fields
                    // for some reason
                    // default: { type: 'SaneString' }
                    fieldData: { type: 'SaneString' }
                }}
            >
                <div>
                    <Button type='submit'>
                        Save
                    </Button>
                </div>
            </SchemaForm>

            <DefaultForm
                initialValues={{ props: {} }}
                onSubmit={ onSubmit }
                useAjvAsync
                ajvErrorInstancePathPrefix = '/payload'
            >
                {(formikProps) => (
                    <>
                        <FormFields />
                        <Button type='submit'>Speichern</Button>
                    </>
                )}
            </DefaultForm>
        </div>
    )
}

const FormFields = (os) => {
    var { values } = useFormikContext();
    var { type } = values['$'].props;

    if (!type) {
        return (
            <>
                <CoreFields />
                <Alert variant='danger'>
                    <b>Bitte Feld-Typ auswählen!</b>
                </Alert>
            </>
        )
    }
    
    var DefinitionFields = switchDefinitionFields(type)

    return (
        <>
            <CoreFields />
            <DefinitionFields />
        </>
    )
}

const CoreFields = (ps) => {
    return (
        <>
            <Fields.GenericEnum
                label='Feld-Typ'
                dataXPath='$.props.type'
                options={ fieldtypes }
                required
            />
            <hr />
            <KeyAndDisplayName />
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

    'HelperSetItemId': 'Hilfstabellen-Eintrag',
    'HelperSetItemIdList': 'Liste von Hisfstabellen-Einträgen',
    'ForeignId': 'Eintrag anderer Haupt-Tabellen (ForeignId)',
    'ForeignIdList': 'Liste von Einträgen anderer Haupt-Tabellen',
    
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

const switchDefinitionFields = (type) => {
    var Component = {
        'SaneString': SaneStringDefinitionFields,
        'FullText': FullTextDefinitionFields,
        
        'Integer': IntegerDefinitionFields,
        'DefaultBool': DefaultBoolDefinitionFields,
        'ExtBool': ExtBoolDefinitionFields,
        
        'DateTime': DateTimeDefinitionFields,
        'DateOnlyServerSide': DateOnlyServerSideDefinitionFields,

        'HelperSetItemId': HelperSetItemIdDefinitionFields,
        'HelperSetItemIdList': HelperSetItemIdListDefinitionFields,
        'ForeignId': ForeignIdDefinitionFields,
        'ForeignIdList': ForeignIdListDefinitionFields,
        
        'Address': AddressDefinitionFields,
        'GeoCoords': GeoCoordsDefinitionFields,
        'BiologicalGender': BiologicalGenderDefinitionFields,

        'Email': EmailDefinitionFields,
        'EmailList': EmailListDefinitionFields,
        'Phone': PhoneDefinitionFields,
        'PhoneList': PhoneListDefinitionFields,
        'PhoneWithTypeList': PhoneWithTypeListDefinitionFields,
    }[type];

    if (!Component) {
        return `ERROR: unknown type "${type}"`
    }
    return Component;
}

const SaneStringDefinitionFields = (ps) => {
    return (
        <>
            <MinLengthProp />
        </>
    )
}

const FullTextDefinitionFields = (ps) => {
    return (
        <>
            <MinLengthProp />
        </>
    )
}

const IntegerDefinitionFields = (ps) => {
    return (
        <>
            <Fields.Integer
                label='Minimum'
                dataXPath='$.props.props.minimum'
            />
            <IsNullableProp />
        </>
    )
}
const DefaultBoolDefinitionFields = (ps) => {
    return null
}
const ExtBoolDefinitionFields = (ps) => {
    return null
}

const DateTimeDefinitionFields = (ps) => {
    return (
        <>
            <IsSpecialAgeFrameFieldProp />
            <IsNullableProp />
        </>
    )
}
const DateOnlyServerSideDefinitionFields = (ps) => {
    return (
        <>
            <IsSpecialAgeFrameFieldProp />
            <IsNullableProp />
        </>
    )
}

const HelperSetItemIdDefinitionFields = (ps) => {
    return (
        <>
            <SetIdProp />
            <IsNullableProp />
        </>
    )
}

const HelperSetItemIdListDefinitionFields = (ps) => {
    return (
        <>
            <SetIdProp />
            <MinItemsProp />
        </>
    )
}

const ForeignIdDefinitionFields = (ps) => {
    return (
        <>
            <SharedForeignIdProps />
        </>
    )
}

const ForeignIdListDefinitionFields = (ps) => {
    return (
        <>
            <SharedForeignIdProps />
            <MinItemsProp />
        </>
    )
}

const AddressDefinitionFields = (ps) => {
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
const GeoCoordsDefinitionFields = (ps) => {
    return null;
}

const BiologicalGenderDefinitionFields = (ps) => {
    return null;
}

const EmailDefinitionFields = (ps) => {
    return null;
}

const EmailListDefinitionFields = (ps) => {
    return (
        <>
            <MinItemsProp />
        </>
    )
}

const PhoneDefinitionFields = (ps) => {
    return null;
}

const PhoneListDefinitionFields = (ps) => {
    return (
        <>
            <MinItemsProp />
        </>
    )
}
const PhoneWithTypeListDefinitionFields = (ps) => {
    return (
        <>
            <MinItemsProp />
        </>
    )
}

//
// utility fields
//

const KeyAndDisplayName = () => {
    var { setFieldValue } = useFormikContext();

    return (
        <>
            <Fields.SaneString
                label='Anzeigename'
                dataXPath='$.props.displayName'
                extraOnChange={ (next) => {
                    setFieldValue(
                        '$.props.type',
                        next.toLowerCase().replaceAll(/[^A-Za-z0-9]/g, '_')
                    );
                }}
                required
            />
            <Fields.SaneString
                label='Interner Key'
                dataXPath='$.props.key'
                required
            />
        </>
    )
}

const MinItemsProp = () => {
    return (
        <Fields.Integer
            label='Mindestanzahl'
            dataXPath='$.props.props.minItems'
            min={ 0 }
        />
    )
}

const MinLengthProp = () => {
    return (
        <Fields.Integer
            label='Zeichen (mindestens)'
            dataXPath='$.props.props.minLength'
            min={ 0 }
        />
    )
}

const IsNullableProp = () => {
    return (
        <Fields.DefaultBool
            label='Optional'
            dataXPath='$.props.props.isNullable'
        />
    )
}

const IsSpecialAgeFrameFieldProp = () => {
    return (
        <Fields.DefaultBool
            label='Altersfenster-Referenz'
            dataXPath='$.props.props.isSpecialAgeFrameField'
        />
    )
}

const SetIdProp = () => {
    return (
        <Fields.ForeignId
            label='Hilfs-Tabelle'
            collection='helperSet'
            dataXPath='$.props.props.setId'
        />
    )
}

const SharedForeignIdProps = () => {
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

export default NewFieldForm;
