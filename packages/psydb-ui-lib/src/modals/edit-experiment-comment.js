import React from 'react';
import { withField } from '@cdxoo/formik-utils';

import { demuxed } from '@mpieva/psydb-ui-utils';
import { useSend } from '@mpieva/psydb-ui-hooks';
import { Button, WithDefaultModal } from '@mpieva/psydb-ui-layout';

import {
    DefaultForm,
    Fields,
} from '../formik';

const CommentField = withField({
    Control: Fields.FullText.Control,
    DefaultWrapper: 'FieldWrapperMultiline'
});

const Body = (ps) => {
    var { onHide, modalPayloadData, onSuccessfulUpdate } = ps;
    var { experimentId, experimentComment } = modalPayloadData;

    var send = useSend((formData) => ({
        type: 'experiment/change-comment',
        payload: { experimentId, ...formData }
    }), {
        onSuccessfulUpdate: demuxed([
            onHide,
            onSuccessfulUpdate
        ])
    })

    return (
        <DefaultForm
            initialValues={{ comment: experimentComment }}
            onSubmit={ send.exec }
            useAjvAsync
        >
            { (formikProps) => (
                <>
                    <CommentField
                        label='Terminkommentar'
                        dataXPath='$.comment'
                    />
                    <div className='mt-3 d-flex justify-content-end'>
                        <Button type='submit'>
                            Speichern
                        </Button>
                    </div>
                </>
            )}
        </DefaultForm>
    )
}


const EditExperimentCommentModal = WithDefaultModal({
    title: 'Terminkommentar bearbeiten',
    size: 'lg',
    Body,
});

export default EditExperimentCommentModal;
