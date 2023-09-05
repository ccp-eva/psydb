import React from 'react';
import {
    useRouteMatch,
    Route,
    Switch,
   // Redirect, // TODO
} from 'react-router-dom';

import { useUITranslation } from '@mpieva/psydb-ui-contexts';
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
    var translate = useUITranslation();

    return (
        <>
            { canSelectInhouse && (
                <Route path={ `${path}/inhouse`}>
                    <TypedSelectionContainer
                        title={ translate('Inhouse Study') }
                        type='inhouse'
                    />
                </Route>
            )}
            { canSelectAwayTeam && (
                <Route path={ `${path}/away-team`}>
                    <TypedSelectionContainer
                        title={ translate('External Study') }
                        type='away-team'
                        singleStudy={ true }
                    />
                </Route>
            )}
            { canSelectVideo && (
                <Route path={ `${path}/online-video-call`}>
                    <TypedSelectionContainer
                        title={ translate('Online Video Anruf') }
                        type='online-video-call'
                    />
                </Route>
            )}
            { canSelectOnlineSurvey && (
                <Route path={ `${path}/online-survey`}>
                    <TypedSelectionContainer
                        title={ translate('Online Umfrage') }
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
