import React from 'react';
import { Base64 } from 'js-base64';

import {
    Redirect,
    useRouteMatch,
    useParams
} from 'react-router-dom';

import {
    Table
} from 'react-bootstrap';

import datefns from '@mpieva/psydb-ui-lib/src/date-fns';
import up from '@mpieva/psydb-ui-lib/src/url-up';
import useFetch from '@mpieva/psydb-ui-lib/src/use-fetch';

import LoadingIndicator from '@mpieva/psydb-ui-lib/src/loading-indicator';

const TargetLocationList = ({
    studyLabelItems
}) => {

    var { path, url } = useRouteMatch();
    var {
        studyType,
        studyIds,
        subjectRecordType,
        searchSettings64
    } = useParams();

    var userSearchSettings = undefined;
    try {
        userSearchSettings = JSON.parse(Base64.decode(searchSettings64));
    }
    catch (e) {}

    if (!userSearchSettings) {
        return (
            <Redirect to={`${up(url, 1)}`} />
        )
    }

    var [ didFetch, fetched ] = useFetch((agent) => {
        var {
            timeFrame,
            ageFrames,
            values,
        } = userSearchSettings

        return agent.searchSubjectsTestableViaAwayTeam({
            studyRecordType: studyType,
            subjectRecordType,
            studyIds: studyIds.split(','),
            timeFrameStart: datefns.startOfDay(
                userSearchSettings.timeFrame.start
            ),
            timeFrameEnd: datefns.endOfDay(
                userSearchSettings.timeFrame.end
            ),
            enabledAgeFrames: ageFrames,
            enabledValues: values,
        })
    }, [ studyIds, subjectRecordType, searchSettings64 ]);

    return (
        <div>FOO</div>
    );
}

export default TargetLocationList;
