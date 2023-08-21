import React from 'react';
import { useRouteMatch, Switch, Route } from 'react-router-dom';

import { groupBy } from '@mpieva/psydb-core-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { usePermissions, useFetch } from '@mpieva/psydb-ui-hooks';
import { PermissionDenied, LoadingIndicator } from '@mpieva/psydb-ui-layout';

import PageWrapper from './page-wrapper';
import IndexNav from './index-nav';
import IndexRouting from './index-routing';


const Calendars = () => {
    var { path } = useRouteMatch();
   
    var translate = useUITranslation();
    var permissions = usePermissions();
   
    var pflags = permissions.gatherFlags((p) => ({
        canViewReception: p.hasFlag(
            'canViewReceptionCalendar'
        ),
        canViewInhouse: p.hasLabOperationFlag(
            'inhouse', 'canViewExperimentCalendar',
        ),
        canViewAwayTeam: p.hasLabOperationFlag(
            'away-team', 'canViewExperimentCalendar',
        ),
        canViewVideo: p.hasLabOperationFlag(
            'online-video-call', 'canViewExperimentCalendar',
        )
    }))

    if (!pflags.hasAny()) {
        return (
            <PageWrapper>
                <PermissionDenied className='mt-2' />
            </PageWrapper>
        )
    }

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.readCustomRecordTypeMetadata()
    ), [])

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { customRecordTypes } = fetched.data;
    var groupedCRTs = groupBy({
        items: customRecordTypes,
        byProp: 'collection'
    });

    return (
        <PageWrapper>
            <Switch>
                <Route exact path={`${path}`}>
                    <IndexNav { ...pflags.all() } />
                </Route>

                <IndexRouting
                    groupedCRTs={ groupedCRTs }
                    { ...pflags.all() }
                />
            </Switch>
        </PageWrapper>
    )
}

export default Calendars;
