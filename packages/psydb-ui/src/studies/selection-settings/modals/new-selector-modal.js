import React from 'react';

import {
    ExactObject,
} from '@mpieva/psydb-schema-fields';

import { createSend } from '@mpieva/psydb-ui-utils';
import { WithDefaultModal } from '@mpieva/psydb-ui-layout';
import { SchemaForm } from '@mpieva/psydb-ui-lib';

const createSchema = ({ subjectTypeMap }) => ExactObject({
    properties: {
        subjectTypeKey: {
            title: 'Probandentyp',
            type: 'string',
            enum: Object.keys(subjectTypeMap),
            enumNames: (
                Object.values(subjectTypeMap)
                .map(it => it.state.label)
            ),
        }
    },
    required: [ 'subjectTypeKey' ]
});

const NewSelectorModalBody = (ps) => {
    var {
        studyId,
        subjectTypeMap,

        onHide,
        onSuccessfulUpdate,
    } = ps;

    var schema = createSchema({ subjectTypeMap });

    var handleSubmit = createSend(({ formData }) => ({
        type: `subjectSelector/create`,
        payload: {
            subjectTypeKey: formData.subjectTypeKey,
            studyId,
            props: {
                isEnabled: true,
                generalConditions: [],
            }
        }
    }), {
        onSuccessfulUpdate: [ onHide, onSuccessfulUpdate ]
    });

    return (
        <SchemaForm
            schema={ schema }
            onSubmit={ handleSubmit }
        />
    );
}

const NewSelectorModal = WithDefaultModal({
    title: 'Probandentyp hinzufügen',
    size: 'lg',

    Body: NewSelectorModalBody
});

export default NewSelectorModal;
