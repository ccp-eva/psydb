import React, { useState, useEffect, useReducer } from 'react';

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
    
    return (
        <PageWrappers.Level2 title='Probandenauswahl'>
            <Switch>
                <Route exact path={ path }>
                    <BigNav items={[
                        {
                            key: 'inhouse',
                            label: 'Interne Studie',
                            linkTo: 'inhouse'
                        }, 
                        {
                            key: 'away-team',
                            label: 'Externe Studie',
                            linkTo: 'away-team'
                        },
                        {
                            key: 'online',
                            label: 'Online',
                            linkTo: 'online'
                        },
                    ]} />
                </Route>
                <Route path={ `${path}/inhouse`}>
                    <InhouseSelectionContainer />
                </Route>
                <Route path={ `${path}/away-team`}>
                    <AwayTeamSelectionContainer />
                </Route>
                <Route path={ `${path}/online`}>
                    <OnlineSelectionContainer />
                </Route>
            </Switch>
        </PageWrappers.Level2>
    )
}

const InhouseSelectionContainer = () => {
    var { path, url } = useRouteMatch();

    return (
        <PageWrappers.Level3 title='Für Interne Studie'>
            <Switch>
                <Route exact path={ `${path}` }>
                    <StudySelect experimentType='inhouse' />
                </Route>
                <Route exact path={ `${path}/:studyIds` }>
                    <SubjectTypeSelect experimentType='inhouse' />
                </Route>
                <Route path={ `${path}/:studyIds/:subjectRecordType` }>
                    <SearchContainer experimentType='inhouse' />
                </Route>
            </Switch>
        </PageWrappers.Level3>
    )
}

const AwayTeamSelectionContainer = () => {
    var { path, url } = useRouteMatch();

    return (
        <PageWrappers.Level3 title='Für Externe Studie'>
            <Switch>
                <Route exact path={ `${path}` }>
                    <StudySelect
                        experimentType='away-team'
                        singleStudy={ true }
                    />
                </Route>
                <Route exact path={ `${path}/:studyIds` }>
                    <SubjectTypeSelect
                        experimentType='away-team'
                    />
                </Route>
                <Route path={ `${path}/:studyIds/:subjectRecordType` }>
                    <SearchContainer
                        experimentType='away-team'
                    />
                </Route>
            </Switch>
        </PageWrappers.Level3>
    )
}

const OnlineSelectionContainer = () => {
    var { path, url } = useRouteMatch();

    return (
        <PageWrappers.Level3 title='Für Online-Umfrage'>
            <Switch>
                <Route exact path={ `${path}` }>
                    <StudySelect
                        experimentType='online'
                        singleStudy={ true }
                    />
                </Route>
                <Route exact path={ `${path}/:studyIds` }>
                    <SubjectTypeSelect
                        experimentType='online'
                    />
                </Route>
                <Route path={ `${path}/:studyIds/:subjectRecordType` }>
                    <SearchContainer
                        experimentType='online'
                    />
                </Route>
            </Switch>
        </PageWrappers.Level3>
    )
}

export default SubjectSelectionRouting;
