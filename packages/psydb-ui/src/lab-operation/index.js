import React from 'react';
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom';

import { groupBy } from '@mpieva/psydb-core-utils';
import { urlUp as up } from '@mpieva/psydb-ui-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { usePermissions, useFetch } from '@mpieva/psydb-ui-hooks';
import { PermissionDenied, LoadingIndicator } from '@mpieva/psydb-ui-layout';
import { RedirectOrTypeNav } from '@mpieva/psydb-ui-lib';

import PageWrapper from './page-wrapper';
import IndexNav from './index-nav';
import IndexRouting from './index-routing';


const LabOperation = () => {
    var { path, url } = useRouteMatch();
    
    var translate = useUITranslation();
    var permissions = usePermissions();

    var pflags = permissions.gatherFlags((p) => ({
        canWriteReservations: p.hasSomeLabOperationFlags({
            types: 'any', flags: [ 'canWriteReservations' ],
        }),
        canSelectSubjects: p.hasSomeLabOperationFlags({
            types: 'any', flags: [
                'canSelectSubjectsForExperiments',
                'canPerformOnlineSurveys'
            ],
        }),
        canConfirmInvitations: p.hasSomeLabOperationFlags({
            types: 'any', flags: [ 'canConfirmSubjectInvitation' ],
        }),
        canPostprocess: p.hasSomeLabOperationFlags({
            types: 'any', flags: [ 'canPostprocessExperiments' ],
        }),
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
                    <RedirectOrTypeNav
                        baseUrl={ `${url}/index` }
                        recordTypes={ groupedCRTs.study }
                    />
                </Route>

                <Route exact path={`${path}/index/:studyType`}>
                    <IndexNav { ...pflags.all() } />
                </Route>

                <IndexRouting
                    customRecordTypes={ customRecordTypes }
                    groupedCRTs={ groupedCRTs }
                    { ...pflags.all() }
                />

            </Switch>
        </PageWrapper>
    )
}

export default LabOperation;
