import React from 'react';

import {
    PerSubjectCommentModal,
    MoveSubjectModal,
    FollowUpSubjectModal,
    RemoveSubjectModal,
} from '@mpieva/psydb-ui-lib/src/modals';

import { RemoveSubjectManualModal } from '../../remove-subject-manual-modal';

const Modals = (ps) => {
    var {
        experimentData,
        studyData,
        subjectDataByType,

        commentModal,
        moveModal,
        followupModal,
        removeModal,
        removeManualModal,

        onSuccessfulUpdate,
    } = ps;

    return (
        <>
            <RemoveSubjectManualModal
                experimentData={ experimentData }
                onSuccessfulUpdate={ onSuccessfulUpdate }
                { ...removeManualModal.passthrough }
            />

            <PerSubjectCommentModal { ...({
                ...commentModal.passthrough,

                experimentData,
                onSuccessfulUpdate,
            }) } />

            <MoveSubjectModal { ...({
                ...moveModal.passthrough,

                experimentType: experimentData.record.type,
                experimentData,
                studyData,
                subjectDataByType,

                onSuccessfulUpdate,
            }) } />
            
            <FollowUpSubjectModal { ...({
                ...followupModal.passthrough,

                experimentType: experimentData.record.type,
                experimentData,
                studyData,
                subjectDataByType,

                onSuccessfulUpdate,
            }) } />

            <RemoveSubjectModal { ...({
                ...removeModal.passthrough,

                experimentData,
                subjectDataByType,

                onSuccessfulUpdate,
            }) } />
        </>
    )
}

export default Modals
