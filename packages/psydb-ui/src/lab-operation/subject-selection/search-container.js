import React, { useState } from 'react';

import {
    Route,
    Switch,
    Redirect,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import { Base64 } from 'js-base64';

import datefns from '@mpieva/psydb-ui-lib/src/date-fns';

import { CRTSettings } from '@mpieva/psydb-common-lib';
import { useFetchAll } from '@mpieva/psydb-ui-hooks';
import { LoadingIndicator } from '@mpieva/psydb-ui-layout';

import InhouseSubjectList from './inhouse/testable-subject-list';
import AwayTeamTargetLocationList from './away-team/target-location-list';
import OnlineVideoCallSubjectList from './online-video-call/testable-subject-list';
import OnlineSubjectList from './online/testable-subject-list';

import { SelectionForm } from './selection-form';

const SearchContainer = (ps) => {
    var { experimentType } = ps;

    var { path, url } = useRouteMatch();
    var history = useHistory();
    var { studyIds: studyIdsString, subjectRecordType } = useParams();

    var studyIds = studyIdsString.split(',');

    var [ didFetch, fetched ] = useFetchAll((agent) => ({
        studies: agent.fetchManyRecords({
            collection: 'study',
            ids: studyIds
        }),
        subjectCRT: agent.readCRTSettings({
            collection: 'subject',
            recordType: subjectRecordType
        }),
        ageFrames: agent.fetchAgeFrames({
            studyIds,
        })
    }), [ studyIdsString, subjectRecordType ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var {
        studies,
        subjectCRT,
        ageFrames
    } = fetched._stageDatas;

    subjectCRT = CRTSettings({ data: subjectCRT });

    var {
        records: ageFrameRecords,
        ...ageFrameRelated
    } = ageFrames;

    var handleSubmit = (formData) => {
        try {
            var { start, end } = formData.interval;

            formData.interval = {
                start: datefns.startOfDay(new Date(start)),
                end: datefns.endOfDay(new Date(end)),
            };

            var json = JSON.stringify(formData);
            var base64 = Base64.encode(json);
            history.push(`${url}/search/${base64}`);
        }
        catch (e) {
            console.log(e);
        }
    }

    var SubjectListComponent = {
        'inhouse': InhouseSubjectList,
        'away-team': AwayTeamTargetLocationList,
        'online-video-call': OnlineVideoCallSubjectList,
        'online-survey': OnlineSubjectList,
    }[experimentType];

    return (
        <Switch>
            <Route exact path={ `${path}` }>
                <div className='p-3 border bg-light'>
                    <SelectionForm { ...({
                        studyRecords: studies.records,
                        subjectCRT,
                        ageFrameRecords,
                        ageFrameRelated,

                        onSubmit: handleSubmit
                    })} />
                </div>
            </Route>
            <Route exact path={ `${path}/search/:searchSettings64` }>
                <SubjectListComponent />
            </Route>
        </Switch>

    );

}

export default SearchContainer;
