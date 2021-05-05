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

import BigNav from '@mpieva/psydb-ui-lib/src/big-nav';
import TabNav from '@mpieva/psydb-ui-lib/src/tab-nav';
import LinkButton from '@mpieva/psydb-ui-lib/src/link-button';
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
        <>
            <h5 className='mt-0 mb-3 text-muted'>
                Probandenauswahl
            </h5>

            <Switch>
                <Route exact path={ path }>
                    <BigNav items={[
                        {
                            key: 'inhouse',
                            label: 'In-House',
                            linkTo: 'inhouse'
                        }, 
                        {
                            key: 'away-team',
                            label: 'via Aussen-Team',
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
                <Route path={ `${path}/online`}>
                    <OnlineSelectionContainer />
                </Route>
            </Switch>
        </>
    )
}

const InhouseSelectionContainer = () => {
    var { path, url } = useRouteMatch();

    return (
        <div>
            <h4 className='border-bottom'>
                Für Inhouse-Experiment
            </h4>
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
        </div>
    )
}

const OnlineSelectionContainer = () => {
    var { path, url } = useRouteMatch();

    return (
        <div>
            <h4 className='border-bottom'>
                Für Online-Experiment
            </h4>
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
        </div>
    )
}

export default SubjectSelectionRouting;
