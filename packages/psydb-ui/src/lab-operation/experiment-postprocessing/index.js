import React, { useMemo, useEffect, useReducer } from 'react';

import {
    Route,
    Switch,
    Redirect,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import agent from '@mpieva/psydb-ui-request-agents';
import RecordTypeNav from '@mpieva/psydb-ui-lib/src/record-type-nav';
import ResearchGroupNav from '@mpieva/psydb-ui-lib/src/research-group-nav';
import ExperimentPostprocessingList from './experiment-postprocessing-list';

const ExperimentPostprocessingRouting = ({
    subjectRecordTypes
}) => {
    var { path, url } = useRouteMatch();

    return (
        <>
            <h5 className='mt-0 mb-3 text-muted'>
                Nachbereitung
            </h5>
                
            <Switch>
                <Route exact path={`${path}`}>
                    <RedirectOrTypeNav
                        baseUrl={ `${url}` }
                        subjectTypes={ subjectRecordTypes }
                    />
                </Route>
                <Route exact path={`${path}/:subjectType`}>
                    <ResearchGroupNav />
                </Route>
                <Route path={`${path}/:subjectType/:researchGroupId`}>
                    <ExperimentPostprocessingList />
                </Route>
            </Switch>
        </>
    );
}

// FIXME redundant
const RedirectOrTypeNav = ({
    baseUrl,
    subjectTypes,
    title,
}) => {
    if (subjectTypes.length === 1) {
        return (
            <Redirect to={
                `${baseUrl}/${subjectTypes[0].type}`
            } />
        )
    }
    else {
        return (
            <>
                { title && (
                    <h2>{ title }</h2>
                )}
                <RecordTypeNav items={ subjectTypes } />
            </>
        )
    }
}

export default ExperimentPostprocessingRouting;
