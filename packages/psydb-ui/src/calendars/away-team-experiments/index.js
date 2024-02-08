import React  from 'react';
import {
    Route,
    Switch,
    useRouteMatch,
} from 'react-router-dom';

import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { usePermissions } from '@mpieva/psydb-ui-hooks';
import { LinkContainer, ErrorFallbacks } from '@mpieva/psydb-ui-layout';
import { RedirectOrTypeNav, ResearchGroupNav } from '@mpieva/psydb-ui-lib';

import Calendar from './calendar';

const AwayTeamExperimentsRouting = (ps) => {
    var { locationTypes } = ps;
    var { path, url } = useRouteMatch();
    
    var translate = useUITranslation();
    var permissions = usePermissions();

    if (!locationTypes?.length) {
        return <ErrorFallbacks.NoLocationTypesDefined className='mt-3' />
    }
    return (
        <>
            <LinkContainer to={ url }>
                <h5 className='mt-0 mb-3 text-muted' role='button'>
                    { translate('External Appointments') }
                </h5>
            </LinkContainer>
                
            <Switch>
                <Route exact path={`${path}`}>
                    <RedirectOrTypeNav
                        baseUrl={ `${url}` }
                        recordTypes={
                            locationTypes.filter(it => (
                                it.state.reservationType === 'away-team'
                            ))
                        }
                    />
                </Route>
                <Route exact path={`${path}/:locationType`}>
                    <ResearchGroupNav
                        autoRedirect={ true }
                        filterIds={
                            permissions.isRoot()
                            ? permissions.raw.forcedResearchGroupId
                            : permissions.getLabOperationFlagIds(
                                'away-team', 'canViewExperimentCalendar'
                            )
                        }
                    />
                </Route>
                <Route path={`${path}/:locationType/:researchGroupId`}>
                    <Calendar />
                </Route>
            </Switch>
        </>
    );
}

export default AwayTeamExperimentsRouting;
