import React from 'react';
import { useRouteMatch, useParams } from 'react-router-dom';

import { useRevision, useModalReducer } from '@mpieva/psydb-ui-hooks';
import StudyAwayTeams from '@mpieva/psydb-ui-lib/src/study-away-teams';

import CreateModal from './create-modal';
import DeleteModal from './delete-modal';


const AwayTeamContainer = (ps) => {
    var { path, url } = useRouteMatch();
    var { studyId, studyType } = useParams();

    var createModal = useModalReducer();
    var deleteModal = useModalReducer();
    var revision = useRevision();

    return (
        <>
            <CreateModal { ...({
                ...createModal.passthrough,
                onSuccessfulUpdate: revision.up,

                studyId,
                studyRecordType: studyType,
            }) } />

            <DeleteModal { ...({
                ...deleteModal.passthrough,
                onSuccessfulUpdate: revision.up,
            })} />

            <StudyAwayTeams { ...({
                variant: 'reservation',
                studyId,
                studyRecordType: studyType,

                onSelectEmptySlot: createModal.handleShow,
                onSelectReservationSlot: deleteModal.handleShow,
                calendarRevision: revision.value
            }) } />
        </>
    )
}

export default AwayTeamContainer;
