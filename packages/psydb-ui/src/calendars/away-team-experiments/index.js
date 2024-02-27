import React  from 'react';
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


const AwayTeamExperimentsRouting = (ps) => {
    var { locationTypes: locationCRTs } = ps;
    var { path, url } = useRouteMatch();
    
    var translate = useUITranslation();
    var permissions = usePermissions();

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.searchResearchGroupMetadata({
            filters: { labMethods: [ 'away-team' ] },
            projectedFields: [ 'locationTypes' ],
        })
    ), []);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }
    
    var { merged, related } = fetched.data;
    var { researchGroupIds, locationTypes } = merged;
   
    var awayTeamLocationCRTs = (
        locationCRTs.filter(it => (
            locationTypes.includes(it.type)
            && it.state.reservationType === 'away-team'
        ))
    )

    if (!awayTeamLocationCRTs?.length) {
        return <ErrorFallbacks.NoLocationTypesDefined className='mt-3' />
    }
    return (
        <PageWrappers.Level2
            title={ translate('External Appointments') }
            titleLinkUrl={ url }
        >
            <Switch>
                <Route exact path={`${path}`}>
                    <RedirectOrTypeNav
                        baseUrl={ `${url}` }
                        recordTypes={ awayTeamLocationCRTs }
                    />
                </Route>
                <Route exact path={`${path}/:locationType`}>
                    <ResearchGroupNav
                        autoRedirect={ true }
                        filterIds={ researchGroupIds }
                    />
                </Route>
                <Route path={`${path}/:locationType/:researchGroupId`}>
                    <Calendar />
                </Route>
            </Switch>
        </PageWrappers.Level2>
    );
}

export default AwayTeamExperimentsRouting;
