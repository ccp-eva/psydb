import React from 'react';
import { useRouteMatch, Route, Switch, Redirect } from 'react-router-dom';

import { useI18N } from '@mpieva/psydb-ui-contexts';
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
    var [{ translate }] = useI18N();

    var pflags = permissions.gatherFlags((p) => ({
        canSelectInhouse: p.hasSomeLabOperationFlags({
            types: [ 'inhouse' ], flags: [
                'canSearchSelectableSubjects',
                'canSelectSubjectsForExperiments'
            ]
        }),
        canSelectAwayTeam: p.hasSomeLabOperationFlags({
            types: [ 'away-team' ], flags: [
                'canSearchSelectableSubjects',
                'canSelectSubjectsForExperiments'
            ]
        }),
        canSelectVideo: p.hasSomeLabOperationFlags({
            types: [ 'online-video-call' ], flags: [
                'canSearchSelectableSubjects',
                'canSelectSubjectsForExperiments'
            ]
        }),
        canSelectOnlineSurvey: p.hasSomeLabOperationFlags({
            types: [ 'online-survey' ], flags: [ 'canPerformOnlineSurveys' ]
        }),
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
