import React, { useState, useEffect, useReducer } from 'react';

import {
    Route,
    Switch,
    Redirect,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import agent from '@mpieva/psydb-ui-request-agents';

import LinkButton from '@mpieva/psydb-ui-lib/src/link-button';
import RecordTypeNav from '@mpieva/psydb-ui-lib/src/record-type-nav';

const StudyTypeSelect = () => {
    var { path, url } = useRouteMatch();
    var { studyIds } = useParams();

    var [
        subjectRecordTypeRecords,
        setSubjectRecordTypeRecords
    ] = useState([]);

    useEffect(() => {
        agent.fetchTestableSubjectTypesForStudies({
            studyIds: studyIds.split(','),
        })
        .then(response => {
            setSubjectRecordTypeRecords(
                response.data.data.subjectRecordTypeRecords
            )
        })
    }, [ studyIds ]);

    if (subjectRecordTypeRecords.length === 1) {
        return (
            <Redirect to={`${url}/${subjectRecordTypeRecords[0].type}`} />
        )
    }

    return (
        <RecordTypeNav items={ subjectRecordTypeRecords } />
    );
}

export default StudyTypeSelect;
