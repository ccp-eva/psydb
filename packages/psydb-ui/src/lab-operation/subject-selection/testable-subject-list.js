import React, { useState, useEffect, useReducer } from 'react';

import {
    Redirect,
    useRouteMatch,
    useParams
} from 'react-router-dom';

import up from '@mpieva/psydb-ui-lib/src/url-up';

const TestableSubjectList = ({
    userSearchSettings
}) => {
    var { path, url } = useRouteMatch();
    var { studyIds, subjectRecordType } = useParams();

    if (!userSearchSettings) {
        return (
            <Redirect to={`${up(url, 1)}`} />
        )
    }
    console.log(userSearchSettings);
    return (
        <div>testable subject list</div>
    );
}

export default TestableSubjectList;
