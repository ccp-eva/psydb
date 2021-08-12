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
import ResearchGroupNav from '@mpieva/psydb-ui-lib/src/research-group-nav';
import RedirectOrTypeNav from '@mpieva/psydb-ui-lib/src/redirect-or-type-nav';
import BigNav from '@mpieva/psydb-ui-lib/src/big-nav';
import ExperimentPostprocessingList from './experiment-postprocessing-list';

var experimentTypeNavItems = [
    { label: 'Interne Termine', linkTo: 'inhouse' },
    { label: 'Externe Termine', linkTo: 'away-team' },
]

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
                    <BigNav items={ experimentTypeNavItems } />
                </Route>
                <Route path={`${path}/:experimentType`}>
                    <ExperimentTypeRouting
                        subjectRecordTypes={ subjectRecordTypes }
                    />
                </Route>
            </Switch>
        </>
    );
}

const ExperimentTypeRouting = ({
    subjectRecordTypes
}) => {
    var { path, url } = useRouteMatch();

    return (
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
    );
}

export default ExperimentPostprocessingRouting;
