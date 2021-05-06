import React, { useState, useEffect } from 'react';

import {
    Button
} from 'react-bootstrap'

import { withTheme } from '@mpieva/rjsf-monkey-patch';
import RJSFCustomTheme from '@mpieva/psydb-ui-lib/src/rjsf-theme';


import agent from '@mpieva/psydb-ui-request-agents';
import FieldDefinitionSchemas from '@mpieva/psydb-common-lib/src/field-definition-schemas';

var createSchema = ({ hasSubChannels }) => ({
    type: 'object',
    properties: {
        ...(hasSubChannels && { subChannelKey: { enum: ['scientific', 'gdpr'] }}),
        fieldData: {
            type: 'object',
            /*oneOf: [
                FieldDefinitionSchemas.SaneString(),
                FieldDefinitionSchemas.BiologicalGender(),
            ]*/
            oneOf: Object.values(FieldDefinitionSchemas).map(f => f())
        }
    }
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
        var message = {
            type: 'custom-record-types/add-field-definition',
            payload: {
                id: record._id,
                lastKnownEventId: record._lastKnownEventId,
                ...(hasSubChannels && ({ subChannelKey: formData.subChannelKey })),
                props: {
                    ...formData.fieldData
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
