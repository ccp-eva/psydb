import React from 'react';

import * as enums from '@mpieva/psydb-schema-enums';
import { useSend } from '@mpieva/psydb-ui-hooks';
import { WithDefaultModal, Button } from '@mpieva/psydb-ui-layout';

import {
    DefaultForm,
    Fields,
} from '@mpieva/psydb-ui-lib';

const Form = (ps) => {
    var { onSubmit, allowedLabOpsTypes } = ps;

    return (
        <DefaultForm
            onSubmit={ onSubmit }
            useAjvAsync
            ajvErrorInstancePathPrefix={ '/payload' }
        >
            {(formikProps) => (
                <>
                    <Fields.GenericEnum
                        label='Ablauf-Typ'
                        dataXPath='$.type'
                        options={ enums.experimentVariants.mapping }
                        allowedValues={ allowedLabOpsTypes }
                    />
                    <Button type='submit'>Speichern</Button>
                </>
            )}
        </DefaultForm>
    )
}

const NewVariantModalBody = (ps) => {
    var {
        studyId,
        allowedLabOpsTypes,

        onHide,
        onSuccessfulUpdate,
    } = ps;

    var send = useSend((formData) => ({
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
        <Form
            allowedLabOpsTypes={ allowedLabOpsTypes }
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
