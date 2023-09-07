import React from 'react';

import { demuxed } from '@mpieva/psydb-ui-utils';
import { useModalReducer } from '@mpieva/psydb-ui-hooks';
import { WithDefaultModal } from '@mpieva/psydb-ui-layout';

import StudyAwayTeams from '@mpieva/psydb-ui-lib/src/study-away-teams';
import ConfirmModal from './confirm-modal';

const SelectAwayTeamSlotModalBody = (ps) => {
    var {
        onHide,

        studyId,
        studyType,
        modalPayloadData,

        onSuccessfulUpdate,
    } = ps;

    var {
        locationRecord,
        selectedSubjectRecords
    } = modalPayloadData;

    var confirmModal = useModalReducer();

    return (
        <>
            
            <ConfirmModal { ...({
                ...confirmModal.passthrough,
                
                studyId,
                locationRecord,
                selectedSubjectRecords,
                onSuccessfulUpdate: demuxed([
                    onHide,
                    onSuccessfulUpdate
                ]),
            }) } />

            <StudyAwayTeams { ...({
                studyId,
                studyRecordType: studyType,
                
                onSelectReservationSlot: confirmModal.handleShow
            }) } />
        </>
    )
}


const SelectAwayTeamSlotModal = WithDefaultModal({
    Body: SelectAwayTeamSlotModalBody,

    size: 'xl',
    title: 'Create Appointment',
    className: 'team-modal',
    backdropClassName: 'team-modal-backdrop',
    bodyClassName: 'bg-white pt-0'
});

export default SelectAwayTeamSlotModal;
