import React from 'react';

import {
    PerSubjectCommentModal,
    MoveSubjectModal,
    FollowUpSubjectModal,
    RemoveSubjectModal,
} from '@mpieva/psydb-ui-lib/src/modals';

import { RemoveSubjectManualModal } from '../../remove-subject-manual-modal';
import { ConsentFormSelectModal } from '../../consent-form-select-modal';

const Modals = (ps) => {
    var {
        experimentData,
        studyData,
        subjectDataByType,

        consentFormSelectModal,
        commentModal,
        moveModal,
        followupModal,
        removeModal,
        removeManualModal,

        onSuccessfulUpdate,
    } = ps;

    var sharedBag = {
        experimentData,
        onSuccessfulUpdate,
    }
    return (
        <>
            <ConsentFormSelectModal
                { ...sharedBag }
                { ...consentFormSelectModal.passthrough }
            />

            <RemoveSubjectManualModal
                { ...sharedBag }
                { ...removeManualModal.passthrough }
            />

            <PerSubjectCommentModal
                { ...sharedBag }
                { ...commentModal.passthrough }
            />

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
