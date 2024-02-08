import React from 'react';

import {
    Route,
    Switch,
    Redirect, // TODO
    useRouteMatch,
} from 'react-router-dom';

import { useUITranslation } from '@mpieva/psydb-ui-contexts';

import { 
    PageWrappers, BigNav, ErrorFallbacks
} from '@mpieva/psydb-ui-layout';

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

    if (!subjectRecordTypes?.length) {
        return (
            <PageWrappers.Level2 title={
                translate('Postprocessing')
            }>
                <ErrorFallbacks.NoSubjectTypesDefined />
            </PageWrappers.Level2>
        )
    }

    return (
        <PageWrappers.Level2 title={
            translate('Postprocessing')
        }>
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
        </PageWrappers.Level2>
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
                <ResearchGroupNav autoRedirect={ true } />
            </Route>
            <Route path={`${path}/:subjectType/:researchGroupId`}>
                <ExperimentPostprocessingList />
            </Route>
        </Switch>
    );
}

export default ExperimentPostprocessingRouting;
