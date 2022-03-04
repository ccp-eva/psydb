import React from 'react';

import {
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import {
    useRevision,
    useModalReducer
} from '@mpieva/psydb-ui-hooks';

import StudyAwayTeams from '@mpieva/psydb-ui-lib/src/study-away-teams';
import CreateModal from './create-modal';
import DeleteModal from './delete-modal';

const AwayTeamContainer = ({}) => {
    var { path, url } = useRouteMatch();
    var { studyId, studyType } = useParams();

    var createModal = useModalReducer();
    var deleteModal = useModalReducer();
    var { value: revision, up: incrementRevision } = useRevision();

    var handleSuccessfulUpdate = () => {
        incrementRevision();
    }

    return (
        <>
            <CreateModal { ...({
                show: createModal.show,
                onHide: createModal.handleHide,
                modalPayloadData: createModal.data,

                onSuccessfulUpdate: handleSuccessfulUpdate,

                studyId,
                studyRecordType: studyType,
            }) } />

            <DeleteModal { ...({
                ...deleteModal.passthrough,
                onSuccessfulUpdate: handleSuccessfulUpdate,
            })} />

            <StudyAwayTeams { ...({
                studyId,
                studyRecordType: studyType,

                onSelectEmptySlot: createModal.handleShow,
                onSelectReservationSlot: deleteModal.handleShow,
                calendarRevision: revision
            }) } />
        </>
    )
}

export default AwayTeamContainer;
