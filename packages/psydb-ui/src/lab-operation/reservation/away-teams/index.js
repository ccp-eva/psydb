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

const AwayTeamContainer = ({}) => {
    var { path, url } = useRouteMatch();
    var { studyId, studyType } = useParams();

    var createModal = useModalReducer();
    var [ revision, incrementRevision ] = useRevision();

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

            <StudyAwayTeams { ...({
                studyId,
                studyRecordType: studyType,

                onSelectEmptySlot: createModal.handleShow,
                calendarRevision: revision
            }) } />
        </>
    )
}

export default AwayTeamContainer;
