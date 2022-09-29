import React from 'react';

import {
    PerSubjectCommentModal,
    MoveSubjectModal,
    FollowUpSubjectModal,
    RemoveSubjectModal,
} from '@mpieva/psydb-ui-lib/src/modals';

import { RemoveSubjectManualModal } from '../../remove-subject-manual-modal';

const Modals = ({
    experimentData,
    studyData,
    subjectDataByType,

    commentModal,
    moveModal,
    followupModal,
    removeModal,
    removeManualModal,

    onSuccessfulUpdate,
}) => {
    return (
        <>
            <RemoveSubjectManualModal
                experimentData= { experimentData }
                { ...removeManualModal.passthrough }
            />
            <PerSubjectCommentModal { ...({
                show: commentModal.show,
                onHide: commentModal.handleHide,
                payloadData: commentModal.data,

                experimentData,

                onSuccessfulUpdate,
            }) } />

            <MoveSubjectModal { ...({
                show: moveModal.show,
                onHide: moveModal.handleHide,
                payloadData: moveModal.data,

                experimentType: experimentData.record.type,
                experimentData,
                studyData,
                subjectDataByType,

                onSuccessfulUpdate,
            }) } />
            
            <FollowUpSubjectModal { ...({
                show: followupModal.show,
                onHide: followupModal.handleHide,
                payloadData: followupModal.data,

                experimentType: experimentData.record.type,
                experimentData,
                studyData,
                subjectDataByType,

                onSuccessfulUpdate,
            }) } />

            <RemoveSubjectModal { ...({
                show: removeModal.show,
                onHide: removeModal.handleHide,
                payloadData: removeModal.data,

                experimentData,
                subjectDataByType,

                onSuccessfulUpdate,
            }) } />
        </>
    )
}

export default Modals
