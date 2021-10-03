import React from 'react';

import {
    PerSubjectCommentModal,
    MoveSubjectModal,
    RemoveSubjectModal,
} from '@mpieva/psydb-ui-lib/src/modals';

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
