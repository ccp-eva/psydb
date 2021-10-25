import React from 'react';

import {
    ExactObject,
} from '@mpieva/psydb-schema-fields';

import { createSend } from '@mpieva/psydb-ui-utils';
import { WithDefaultModal } from '@mpieva/psydb-ui-layout';
import { SchemaForm } from '@mpieva/psydb-ui-lib';

const createSchema = ({ subjectTypesEnum }) => ExactObject({
    properties: {
        subjectTypeKey: {
            title: 'Probandentyp',
            type: 'string',
            enum: Object.keys(subjectTypesEnum),
            enumNames: Object.values(subjectTypesEnum),
        }
    },
    required: [ 'subjectTypeKey' ]
});

const NewSelectorModalBody = (ps) => {
    var {
        studyId,
        subjectTypesEnum,

        onHide,
        onSuccessfulUpdate,
    } = ps;

    var schema = createSchema({ subjectTypesEnum });

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
