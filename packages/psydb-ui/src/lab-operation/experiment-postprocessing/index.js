import React from 'react';

import {
    Route,
    Switch,
    useRouteMatch,
} from 'react-router-dom';

import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useFetch, usePermissions } from '@mpieva/psydb-ui-hooks';

import { 
    PageWrappers, BigNav, ErrorFallbacks, LoadingIndicator
} from '@mpieva/psydb-ui-layout';

import { ResearchGroupNav, RedirectOrTypeNav } from '@mpieva/psydb-ui-lib';
import ExperimentPostprocessingList from './experiment-postprocessing-list';

const ExperimentPostprocessingRouting = (ps) => {
    var { subjectRecordTypes } = ps;

    var translate = useUITranslation();
    var { path, url } = useRouteMatch();

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.searchResearchGroupMetadata({
            filters: {
                labMethods: [ 'inhouse', 'online-video-call', 'away-team' ],
            },
            projectedFields: [ 'labMethods', 'subjectTypes' ],
        })
    ), []);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }
    var { merged, related } = fetched.data;
    var { researchGroupIds, subjectTypes, labMethods } = merged;

    if (!subjectRecordTypes?.length) {
        return (
            <PageWrappers.Level2 title={
                translate('Postprocessing')
            }>
                <ErrorFallbacks.NoSubjectTypesDefined />
            </PageWrappers.Level2>
        )
    }
    if (!labMethods?.length) {
        return (
            <PageWrappers.Level2 title={
                translate('Postprocessing')
            }>
                <ErrorFallbacks.NoLabMethodsDefined />
            </PageWrappers.Level2>
        )
    }

    var navItems = labMethods.map(it => ({
        label: translate(`_labWorkflow_${it}`),
        linkTo: it
    }));

    return (
        <PageWrappers.Level2 title={
            translate('Postprocessing')
        }>
            <Switch>
                <Route exact path={`${path}`}>
                    <BigNav items={ navItems } />
                </Route>
                <Route path={`${path}/:experimentType`}>
                    <ExperimentTypeRouting
                        subjectTypes={ subjectTypes }
                        researchGroupIds={ researchGroupIds }
                        related={ related }
                    />
                </Route>
            </Switch>
        </PageWrappers.Level2>
    );
}

const ExperimentTypeRouting = (ps) => {
    var { researchGroupIds, subjectTypes, related } = ps;
    var { path, url } = useRouteMatch();

    return (
        <Switch>
            <Route exact path={`${path}`}>
                <RedirectOrTypeNav
                    baseUrl={ `${url}` }
                    recordTypes={ subjectTypes }
                    related={ related }
                />
            </Route>
            <Route exact path={`${path}/:subjectType`}>
                <ResearchGroupNav
                    autoRedirect={ true }
                    filterIds={ researchGroupIds }
                />
            </Route>
            <Route path={`${path}/:subjectType/:researchGroupId`}>
                <ExperimentPostprocessingList />
            </Route>
        </Switch>
    );
}

export default ExperimentPostprocessingRouting;
