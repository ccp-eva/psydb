import React, { useState, useEffect, useReducer } from 'react';

import {
    Route,
    Switch,
    Redirect,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import { useRequestAgent } from '@mpieva/psydb-ui-contexts';
import { LinkButton } from '@mpieva/psydb-ui-layout';
import RecordTypeNav from '@mpieva/psydb-ui-lib/src/record-type-nav';

const StudyTypeSelect = ({ labProcedureType }) => {
    var { path, url } = useRouteMatch();
    var { studyIds } = useParams();
    var agent = useRequestAgent();

    var [
        subjectRecordTypeRecords,
        setSubjectRecordTypeRecords
    ] = useState([]);

    useEffect(() => {
        agent.fetchTestableSubjectTypesForStudies({
            studyIds: studyIds.split(','),
            labProcedureType,
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
