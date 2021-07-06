import React from 'react';

import {
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import StudyAwayTeams from '@mpieva/psydb-ui-lib/src/study-away-teams';
const AwayTeamContainer = ({

}) => {
    var { path, url } = useRouteMatch();
    var { studyId, studyType } = useParams();

    return (
        <StudyAwayTeams { ...({
            studyId,
            studyRecordType: studyType
        }) } />
    )
}

export default AwayTeamContainer;
