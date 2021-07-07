import React from 'react';

import {
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import useModalReducer from '@mpieva/psydb-ui-lib/src/use-modal-reducer';
import StudyAwayTeams from '@mpieva/psydb-ui-lib/src/study-away-teams';

import CreateModal from './create-modal';

const AwayTeamContainer = ({}) => {
    var { path, url } = useRouteMatch();
    var { studyId, studyType } = useParams();

    var createModal = useModalReducer();

    return (
        <>
            <CreateModal { ...({
                show: createModal.show,
                onHide: createModal.handleHide,
                modalPayloadData: createModal.data,

                studyId,
                studyRecordType: studyType,
            }) } />

            <StudyAwayTeams { ...({
                studyId,
                studyRecordType: studyType,

                onSelectEmptySlot: createModal.handleShow
            }) } />
        </>
    )
}

export default AwayTeamContainer;
