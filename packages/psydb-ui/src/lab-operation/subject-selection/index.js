import React, { useState, useEffect, useReducer } from 'react';
import { usePermissions } from '@mpieva/psydb-ui-hooks';

import {
    Route,
    Switch,
    Redirect,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import agent from '@mpieva/psydb-ui-request-agents';

import {
    BigNav,
    TabNav,
    LinkButton,
    PageWrappers
} from '@mpieva/psydb-ui-layout';

import RecordListContainer from '@mpieva/psydb-ui-lib/src/record-list-container';

import StudySelect from './study-select';
import SubjectTypeSelect from './subject-type-select';
import SearchContainer from './search-container';

// FIXME: to prevent the user from having to select
// away-team/inhouse in case where there are no inhouse studies
// we could hav an endpoint to determine if there are studies
// that are enabled for that type of testing
// and decide based on that
const SubjectSelectionRouting = () => {
    var { path, url } = useRouteMatch();
    var permissions = usePermissions();

    var canSelectInhouse = permissions.hasLabOperationFlag(
        'inhouse', 'canSelectSubjectsForExperiments'
    );
    var canSelectAwayTeam = permissions.hasLabOperationFlag(
        'away-team', 'canSelectSubjectsForExperiments'
    );
    var canSelectVideo = permissions.hasLabOperationFlag(
        'online-video-call', 'canSelectSubjectsForExperiments'
    );
    var canSelectOnlineSurvey = permissions.hasLabOperationFlag(
        'online-survey', 'canPerformOnlineSurveys'
    );

    var canSelectInhouseGroupSimple = true;

    var navItems = [
        (canSelectInhouse && {
            key: 'inhouse',
            label: 'Interne Studie',
            linkTo: 'inhouse'
        }), 
        (canSelectAwayTeam && {
            key: 'away-team',
            label: 'Externe Studie',
            linkTo: 'away-team'
        }),
        (canSelectVideo && {
            key: 'online-video-call',
            label: 'Online-Video-Anruf',
            linkTo: 'online-video-call'
        }),
        (canSelectOnlineSurvey && {
            key: 'online-survey',
            label: 'Online-Umfrage',
            linkTo: 'online-survey'
        }),
        /*(canSelectInhouseGroupSimple && {
            key: 'inhouse-group-simple',
            label: 'Interne Gruppen Studie (WKPRC)',
            linkTo: 'inhouse-group-simple'
        }),*/
    ].filter(it => !!it)

    return (
        <PageWrappers.Level2 title='Proband:innenauswahl'>
            <Switch>
                <Route exact path={ path }>
                    <BigNav items={ navItems } />
                </Route>
                { canSelectInhouse && (
                    <Route path={ `${path}/inhouse`}>
                        <TypedSelectionContainer
                            title='Für Interne Studie'
                            type='inhouse'
                        />
                    </Route>
                )}
                { canSelectAwayTeam && (
                    <Route path={ `${path}/away-team`}>
                        <TypedSelectionContainer
                            title='Für Externe Studie'
                            type='away-team'
                            singleStudy={ true }
                        />
                    </Route>
                )}
                { canSelectVideo && (
                    <Route path={ `${path}/online-video-call`}>
                        <TypedSelectionContainer
                            title='Für Online-Video-Anruf'
                            type='online-video-call'
                        />
                    </Route>
                )}
                { canSelectOnlineSurvey && (
                    <Route path={ `${path}/online-survey`}>
                        <TypedSelectionContainer
                            title='Für Online-Umfrage'
                            type='online-survey'
                            singleStudy={ true }
                        />
                    </Route>
                )}
                {/* canSelectInhouseGroupSimple && (
                    <Route path={ `${path}/inhouse-group-simple`}>
                        <TypedSelectionContainer
                            title='Für Interne Gruppen Studie (WKPRC)'
                            type='inhouse-group-simple'
                        />
                    </Route>
                )*/}
            </Switch>
        </PageWrappers.Level2>
    )
}

const TypedSelectionContainer = (ps) => {
    var { title, type, singleStudy } = ps;
    var { path, url } = useRouteMatch();

    return (
        <PageWrappers.Level3 title={ title }>
            <Switch>
                <Route exact path={ `${path}` }>
                    <StudySelect
                        experimentType={ type }
                        singleStudy={ singleStudy }
                    />
                </Route>
                <Route exact path={ `${path}/:studyIds` }>
                    <SubjectTypeSelect labProcedureType={ type } />
                </Route>
                <Route path={ `${path}/:studyIds/:subjectRecordType` }>
                    <SearchContainer experimentType={ type } />
                </Route>
            </Switch>
        </PageWrappers.Level3>
    )
}

export default SubjectSelectionRouting;
