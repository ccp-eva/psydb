import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useFetch, useSend } from '@mpieva/psydb-ui-hooks';
import { Button, WithDefaultModal } from '@mpieva/psydb-ui-layout';

import {
    DefaultForm,
    Fields,
} from '../formik';

const PerSubjectCommentModalBody = (ps) => {
    var {
        onHide,

        shouldFetch,
        experimentId,
        experimentType,

        experimentData,
        modalPayloadData,

        onSuccessfulUpdate,
    } = ps;

    var translate = useUITranslation();

    var [ didFetch, fetched ] = useFetch((agent) => {
        if (shouldFetch) {
            return agent.fetchExtendedExperimentData({
                experimentType,
                experimentId,
            })
        }
    }, [ experimentId ]);

    if (shouldFetch && !didFetch) {
        return null;
    }

    experimentData = experimentData || fetched.data.experimentData;

    var {
        subjectId,
        subjectType
    } = modalPayloadData;

    var subjectData = experimentData.record.state.subjectData.find(it => (
        it.subjectId === subjectId
    ));

    var send = useSend((formData) => ({
        type: 'experiment/change-per-subject-comment',
        payload: {
            experimentId: experimentData.record._id,
            subjectId,
            ...formData,
        }
    }), { onSuccessfulUpdate: [ onHide, onSuccessfulUpdate ] });

    return (
        <DefaultForm
            initialValues={{ comment: subjectData.comment }}
            onSubmit={ send.exec }
            useAjvAsync
        >
            { (formikProps) => (
                <>
                    <Fields.SaneString
                        label={ translate('_appointment_comment') }
                        dataXPath='$.comment'
                    />
                    <div className='mt-3 d-flex justify-content-end'>
                        <Button type='submit'>
                            { translate('Save') }
                        </Button>
                    </div>
                </>
            )}
        </DefaultForm>
    )
}

const PerSubjectCommentModal = WithDefaultModal({
    title: 'Edit Appointment Comment',
    size: 'lg',
    Body: PerSubjectCommentModalBody
});


export default PerSubjectCommentModal;
