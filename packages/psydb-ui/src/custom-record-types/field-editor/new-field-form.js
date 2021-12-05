import React, { useState, useEffect } from 'react';

import { Button } from '@mpieva/psydb-ui-layout';

import { withTheme } from '@mpieva/rjsf-monkey-patch';
import { RJSFCustomTheme } from '@mpieva/psydb-ui-lib';


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
        </div>
    )

}

export default NewFieldForm;
