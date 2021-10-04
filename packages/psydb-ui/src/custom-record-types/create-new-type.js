import React, { useEffect } from 'react';
import agent from '@mpieva/psydb-ui-request-agents';

import FormBox from '@mpieva/psydb-ui-lib/src/form-box';
import { SchemaForm } from '@mpieva/psydb-ui-schema-form';

import {
    ExactObject,
    IdentifierString,
    SaneString,
    CustomRecordTypeCollectionEnum,
} from '@mpieva/psydb-schema-fields';

const schema = ExactObject({
    properties: {
        collection: CustomRecordTypeCollectionEnum({ title: 'Collection' }),
        type: IdentifierString({
            title: 'Interner Type-Key',
            minLength: 1,
        }),
        label: SaneString({
            title: 'Anzeigename',
            minLength: 1,
        }),
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
            agent.send({ message: messageBody })
            .then(
                (response) => {
                    var body = response.data;
                    console.log(response);
                    onCreated && onCreated({
                        id: body.data.find(
                            it => it.collectionName === 'customRecordType'
                        ).channelId
                    });
                }
            )
        )
    };

    return (
        <FormBox title='Neuer Datensatz-Typ'>
            <SchemaForm
                schema={ schema }
                onSubmit={ onSubmit }
            />
        </FormBox>
    )
}

export default CreateNewType;
