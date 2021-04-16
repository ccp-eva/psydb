import React, { useState, useEffect } from 'react';

import { withTheme } from '@rjsf/core';
import { Theme as Bootstrap4Theme } from '@rjsf/bootstrap-4'


import agent from '@mpieva/psydb-ui-request-agents';
import FieldDefinitionSchemas from '@mpieva/psydb-common-lib/src/field-definition-schemas';

var schema = {
    type: 'object',
    oneOf: Object.values(FieldDefinitionSchemas).map(f => f())
};

var uiSchema = {
    'type': {
        // FIXME: there are some margins still left unfortunately
        // https://github.com/rjsf-team/react-jsonschema-form/pull/2175
        'ui:widget': 'hidden'
    }
}

var SchemaForm = withTheme(Bootstrap4Theme);

const NewFieldForm = ({ record, onSuccess }) => {
    var onSubmit = ({ formData, ...unused }) => {
        var message = {
            type: 'custom-record-types/add-field-definition',
            payload: {
                id: record._id,
                lastKnownEventId: record._lastKnownEventId,
                props: formData
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
                schema={ schema }
                uiSchema={ uiSchema }
                onSubmit={ onSubmit }
            >
                <div>
                    <button type="submit" className="btn btn-info">
                        Save
                    </button>
                </div>
            </SchemaForm>
        </div>
    )

}

export default NewFieldForm;
