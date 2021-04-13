import React, { useEffect } from 'react';
import agent from '@mpieva/psydb-ui-request-agents';

import { withTheme } from '@rjsf/core';
import { Theme as Bootstrap4Theme } from '@rjsf/bootstrap-4'

var SchemaForm = withTheme(Bootstrap4Theme);

import {
    ExactObject,
    IdentifierString,
    SaneString,
    CustomRecordTypeCollectionEnum,
} from '@mpieva/psydb-schema-fields';

const schema = ExactObject({
    properties: {
        collection: CustomRecordTypeCollectionEnum({ title: 'Collection' }),
        type: IdentifierString({ title: 'Interner Type-Key' }),
        label: SaneString({ title: 'Anzeigename' }),
    },
    required: [
        'collection',
        'type',
        'label',
    ]
})

const CreateNewType = ({ onCreated }) => {
    var onSubmit = ({ formData, ...unused }) => {
        var messageBody = {
            type: 'custom-record-types/create',
            payload: {
                collection: formData.collection,
                type: formData.type,
                props: {
                    label: formData.label
                }
            }
        };

        return (
            agent.post('/api/', messageBody)
            .then(
                (response) => {
                    var body = response.data;
                    console.log(response);
                    onCreated && onCreated({
                        id: body.data.find(
                            it => it.collectionName === 'customRecordType'
                        ).channelId
                    });
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
                onSubmit={ onSubmit }
            >
                <div>
                    <button type="submit" className="btn btn-primary">
                        Create
                    </button>
                </div>
            </SchemaForm>
        </div>
    )
}

export default CreateNewType;
