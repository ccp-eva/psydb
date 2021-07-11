import React from 'react';
import { Base64 } from 'js-base64';

import {
    Redirect,
    useRouteMatch,
    useParams
} from 'react-router-dom';

import datefns from '@mpieva/psydb-ui-lib/src/date-fns';
import up from '@mpieva/psydb-ui-lib/src/url-up';
import useFetch from '@mpieva/psydb-ui-lib/src/use-fetch';

import LoadingIndicator from '@mpieva/psydb-ui-lib/src/loading-indicator';

import TargetLocationTable from './target-location-table';

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

    if (!didFetch) {
        return (
            <LoadingIndicator size='lg' />
        )
    }

    var {
        mergedRecords,
        subjectMetadata,
        locationMetadata,
        experimentMetadata,
    } = fetched.data;

    return (
        <TargetLocationTable { ...({
            mergedRecords,
            subjectMetadata,
            locationMetadata,
            experimentMetadata
        }) } />
    );
}

export default TargetLocationList;
