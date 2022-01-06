import React from 'react';

import {
    ExactObject,
    ExperimentVariantEnum
} from '@mpieva/psydb-schema-fields';

import { demuxed } from '@mpieva/psydb-ui-utils';
import { useSend } from '@mpieva/psydb-ui-hooks';
import { WithDefaultModal } from '@mpieva/psydb-ui-layout';
import { SchemaForm } from '@mpieva/psydb-ui-lib';

const schema = ExactObject({
    properties: {
        type: ExperimentVariantEnum(),
    },
    required: [ 'type' ]
});

const NewVariantModalBody = (ps) => {
    var {
        studyId,

        onHide,
        onSuccessfulUpdate,
    } = ps;

    var send = useSend(({ formData }) => ({
        type: `experimentVariant/create`,
        payload: {
            type: formData.type,
            studyId,
            props: {
                isEnabled: true
            }
        }
    }), {
        onSuccessfulUpdate: [ onHide, onSuccessfulUpdate ]
    });
    return (
        <SchemaForm
            schema={ schema }
            onSubmit={ send.exec }
        />
    );
}

const NewVariantModal = WithDefaultModal({
    title: 'Neuer Ablauf',
    size: 'md',

    Body: NewVariantModalBody
});

export default NewVariantModal;
