import React from 'react';
import {
    useRouteMatch,
    Route,
    Switch,
   // Redirect, // TODO
} from 'react-router-dom';

import { PageWrappers } from '@mpieva/psydb-ui-layout';

import StudySelect from './study-select';
import SubjectTypeSelect from './subject-type-select';
import SearchContainer from './search-container';

const IndexRouting = (ps) => {
    var {
        canSelectInhouse,
        canSelectAwayTeam,
        canSelectVideo,
        canSelectOnlineSurvey,
    } = ps;

    var { url, path } = useRouteMatch();

    return (
        <>
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
        </>
    );
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

export default IndexRouting;
