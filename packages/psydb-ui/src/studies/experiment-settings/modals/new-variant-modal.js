import React from 'react';

import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useSend } from '@mpieva/psydb-ui-hooks';
import { WithDefaultModal, Button } from '@mpieva/psydb-ui-layout';

import {
    DefaultForm,
    Fields,
} from '@mpieva/psydb-ui-lib';

const Form = (ps) => {
    var { onSubmit, allowedLabOpsTypes } = ps;

    var translate = useUITranslation();

    return (
        <DefaultForm
            onSubmit={ onSubmit }
            useAjvAsync
            ajvErrorInstancePathPrefix={ '/payload' }
        >
            {(formikProps) => (
                <>
                    <Fields.LabMethodKey
                        label={ translate('Lab Workflow Type') }
                        dataXPath='$.type'
                        allowedValues={ allowedLabOpsTypes }
                    />
                    <Button type='submit'>
                        { translate('Save') }
                    </Button>
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
    title: 'Add Lab Workflow',
    size: 'lg',

    Body: NewVariantModalBody
});

export default NewVariantModal;
