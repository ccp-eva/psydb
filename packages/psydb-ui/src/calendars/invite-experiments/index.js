import React from 'react';
import {
    Route,
    Switch,
    useRouteMatch,
} from 'react-router-dom';

import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useFetch, usePermissions } from '@mpieva/psydb-ui-hooks';

import {
    PageWrappers,
    ErrorFallbacks,
    LoadingIndicator
} from '@mpieva/psydb-ui-layout';

import { RedirectOrTypeNav, ResearchGroupNav } from '@mpieva/psydb-ui-lib';

import Calendar from './calendar';


const getTitleByType = (inviteType) => {
    var title = {
        'inhouse': 'Inhouse Appointments',
        'online-video-call': 'Video Appointments'
    }[inviteType];

    title = title || inviteType;

    return title;
}

const InviteExperimentsRouting = (ps) => {
    var { inviteType } = ps;
    var { path, url } = useRouteMatch();
    
    var translate = useUITranslation();
    var permissions = usePermissions();

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.searchResearchGroupMetadata({
            filters: { labMethods: [ inviteType ] },
            projectedFields: [ 'subjectTypes' ],
        })
    ), [ inviteType ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { merged, related } = fetched.data;
    var { researchGroupIds, subjectTypes } = merged;

    if (!subjectTypes?.length) {
        return <ErrorFallbacks.NoSubjectTypesDefined className='mt-3' />
    }

    return (
        <PageWrappers.Level2
            title={ translate(getTitleByType(inviteType)) }
            titleLinkUrl={ url }
        >
            <Switch>
                <Route exact path={`${path}`}>
                    <RedirectOrTypeNav
                        baseUrl={ `${url}` }
                        recordTypes={ merged.subjectTypes }
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
                    <Calendar inviteType={ inviteType } />
                </Route>
            </Switch>
        </PageWrappers.Level2>
    );
}

export default InviteExperimentsRouting;
