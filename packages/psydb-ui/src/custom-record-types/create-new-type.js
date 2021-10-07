import React from 'react';

import { createSend } from '@mpieva/psydb-ui-utils';
import FormBox from '@mpieva/psydb-ui-lib/src/form-box';
import { SchemaForm } from '@mpieva/psydb-ui-lib';

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
    var onSuccessfulUpdate = (response) => {
        var recordId = response.data.data.find(it => (
            it.collectionName === 'customRecordType'
        )).channelId;

        onCreated && onCreated({
            id: recordId,
            response
        });
    }

    var onSubmit = createSend(({ formData }) => ({
        type: 'custom-record-types/create',
        payload: {
            collection: formData.collection,
            type: formData.type,
            props: {
                label: formData.label
            }
        }
    }), { onSuccessfulUpdate });

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
