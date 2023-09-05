import React from 'react';

import {
    useRouteMatch,
    Route,
    Switch,
    // Redirect, // TODO
} from 'react-router-dom';

import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { usePermissions } from '@mpieva/psydb-ui-hooks';
import { PageWrappers } from '@mpieva/psydb-ui-layout';

import IndexNav from './index-nav';
import IndexRouting from './index-routing';

// FIXME: to prevent the user from having to select
// away-team/inhouse in case where there are no inhouse studies
// we could hav an endpoint to determine if there are studies
// that are enabled for that type of testing
// and decide based on that
const SubjectSelectionRouting = () => {
    var { path, url } = useRouteMatch();
    
    var permissions = usePermissions();
    var translate = useUITranslation();

    var pflags = permissions.gatherFlags((p) => ({
        canSelectInhouse: p.hasLabOperationFlag(
            'inhouse', 'canSelectSubjectsForExperiments'
        ),
        canSelectAwayTeam: p.hasLabOperationFlag(
            'away-team', 'canSelectSubjectsForExperiments'
        ),
        canSelectVideo: p.hasLabOperationFlag(
            'online-video-call', 'canSelectSubjectsForExperiments'
        ),
        canSelectOnlineSurvey: p.hasLabOperationFlag(
            'online-survey', 'canPerformOnlineSurveys'
        ),
    }));

    return (
        <PageWrappers.Level2 title={ translate('Subject Selection') }>
            <Switch>
                <Route exact path={ path }>
                    <IndexNav { ...pflags.all() } />
                </Route>

                <IndexRouting { ...pflags.all() } />
            </Switch>
        </PageWrappers.Level2>
    )
}

export default SubjectSelectionRouting;
