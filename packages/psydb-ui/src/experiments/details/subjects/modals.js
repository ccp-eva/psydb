import React from 'react';

import CommentModal from '@mpieva/psydb-ui-lib/src/per-subject-comment-modal';
import MoveModal from '@mpieva/psydb-ui-lib/src/move-subject-modal';
import RemoveModal from '@mpieva/psydb-ui-lib/src/remove-subject-modal';

const Modals = ({
    experimentData,
    studyData,
    subjectDataByType,

    commentModal,
    moveModal,
    removeModal,

    onSuccessfulUpdate,
}) => {
    return (
        <>
            <CommentModal { ...({
                show: commentModal.show,
                onHide: commentModal.handleHide,
                payloadData: commentModal.data,

                experimentData,

                onSuccessfulUpdate,
            }) } />

            <MoveModal { ...({
                show: moveModal.show,
                onHide: moveModal.handleHide,
                payloadData: moveModal.data,

                experimentData,
                studyData,
                subjectDataByType,

                onSuccessfulUpdate,
            }) } />

            <RemoveModal { ...({
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
