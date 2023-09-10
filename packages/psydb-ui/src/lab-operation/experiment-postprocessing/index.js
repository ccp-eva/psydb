import React from 'react';

import {
    Route,
    Switch,
    Redirect, // TODO
    useRouteMatch,
} from 'react-router-dom';

import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { BigNav } from '@mpieva/psydb-ui-layout';
import { ResearchGroupNav, RedirectOrTypeNav } from '@mpieva/psydb-ui-lib';
import ExperimentPostprocessingList from './experiment-postprocessing-list';

const ExperimentPostprocessingRouting = (ps) => {
    var { subjectRecordTypes } = ps;

    var translate = useUITranslation();
    var { path, url } = useRouteMatch();

    var experimentTypeNavItems = [
        {
            label: translate('Inhouse Appointments'),
            linkTo: 'inhouse'
        },
        {
            label: translate('External Appointments'),
            linkTo: 'away-team'
        },
        {
            label: translate('Online Video Appointments'),
            linkTo: 'online-video-call'
        },
    ]

    return (
        <>
            <h5 className='mt-0 mb-3 text-muted'>
                { translate('Postprocessing') }
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

const ExperimentTypeRouting = (ps) => {
    var { subjectRecordTypes } = ps;
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
