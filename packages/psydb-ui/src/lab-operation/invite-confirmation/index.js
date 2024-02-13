import React from 'react';
import { unique } from '@mpieva/psydb-core-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useFetch, usePermissions } from '@mpieva/psydb-ui-hooks';

import {
    Route,
    Switch,
    Redirect,
    useRouteMatch,
} from 'react-router-dom';

import {
    PageWrappers,
    ErrorFallbacks,
    LoadingIndicator
} from '@mpieva/psydb-ui-layout';

import {
    RedirectOrTypeNav,
    ResearchGroupNav
} from '@mpieva/psydb-ui-lib';

import InviteConfirmationList from './invite-confirmation-list';

const InviteConfirmationRouting = (ps) => {
    var { path, url } = useRouteMatch();
    var translate = useUITranslation();
    var permissions = usePermissions();

    var allowedResearchGroupIds = unique([
        ...permissions.getLabOperationFlagIds(
            'inhouse', 'canConfirmSubjectInvitation'
        ),
        ...permissions.getLabOperationFlagIds(
            'online-video-call', 'canConfirmSubjectInvitation'
        ),
    ]);

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.searchResearchGroupMetadata({
            filters: {
                researchGroupIds: allowedResearchGroupIds,
                labMethods: [ 'inhouse', 'online-video-call' ]
            },
            projectedFields: [ 'subjectTypes' ],
        })
    ), []);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { merged, related } = fetched.data;
    var { researchGroupIds, subjectTypes } = merged;

    if (!subjectTypes?.length) {
        return (
            <PageWrappers.Level2 title={
                translate('Confirm Appointments')
            }>
                <ErrorFallbacks.NoSubjectTypesDefined />
            </PageWrappers.Level2>
        )
    }


    return (
        <PageWrappers.Level2 title={
            translate('Confirm Appointments')
        }>
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
                    <InviteConfirmationList />
                </Route>
            </Switch>
        </PageWrappers.Level2>
    );
}

export default InviteConfirmationRouting;
