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
                            key: 'online-video-call',
                            label: 'Online-Video-Anruf',
                            linkTo: 'online-video-call'
                        },
                        {
                            key: 'online-survey',
                            label: 'Online-Umfrage',
                            linkTo: 'online-survey'
                        },
                    ]} />
                </Route>
                <Route path={ `${path}/inhouse`}>
                    <TypedSelectionContainer
                        title='Für Interne Studie'
                        type='inhouse'
                    />
                </Route>
                <Route path={ `${path}/away-team`}>
                    <TypedSelectionContainer
                        title='Für Externe Studie'
                        type='away-team'
                        singleStudy={ true }
                    />
                </Route>
                <Route path={ `${path}/online-video-call`}>
                    <TypedSelectionContainer
                        title='Für Online-Video-Anruf'
                        type='online-video-call'
                    />
                </Route>
                <Route path={ `${path}/online-survey`}>
                    <TypedSelectionContainer
                        title='Für Online-Umfrage'
                        type='online-survey'
                        singleStudy={ true }
                    />
                </Route>
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
