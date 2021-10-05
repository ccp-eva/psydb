import React, { useState, useEffect } from 'react';
import omit from '@cdxoo/omit';

import { Button } from '@mpieva/psydb-ui-layout';
import { SchemaForm } from '@mpieva/psydb-ui-lib';

import agent from '@mpieva/psydb-ui-request-agents';
import FieldDefinitionSchemas from '@mpieva/psydb-common-lib/src/field-definition-schemas';

var createSchema = ({ field }) => {
    if (field.isNew) {
        return {
            type: 'object',
            oneOf: Object.values(FieldDefinitionSchemas).map(f => f())
        };
    }
    else {
        var baseSchema = FieldDefinitionSchemas[field.type]();
        return {
            type: 'object',
            properties: {
                // FIXME: so we probably want some of the other field props
                // such as min length maybe?
                displayName: baseSchema.properties.displayName,
                //oneOf: Object.values(FieldDefinitionSchemas).map(f => f())
            }
        }
    }
};

var uiSchema = {
    'type': {
        // FIXME: there are some margins still left unfortunately
        // https://github.com/rjsf-team/react-jsonschema-form/pull/2175
        'ui:widget': 'hidden'
    }
}

const EditFieldForm = ({ record, field, onSuccess }) => {

    console.log(field);

    var schema = createSchema({ field });

    var onSubmit = ({ formData, ...unused }) => {
        var message = {
            type: 'custom-record-types/patch-field-definition',
            payload: {
                id: record._id,
                lastKnownEventId: record._lastKnownEventId,
                subChannelKey: field.subChannelKey,
                fieldKey: field.key,
                props: {
                    ...formData
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
            )
        )
    };
    return (
        <div>
            <SchemaForm
                schema={ schema }
                uiSchema={ uiSchema }
                formData={
                    field.isNew
                    ? omit(
                        [ 'isDirty', 'isNew', 'subChannelKey'],
                        field
                    )
                    : ({
                        // FIXME
                        displayName: field.displayName
                    })
                }
                onSubmit={ onSubmit }
            />
        </div>
    )

}

export default EditFieldForm;
