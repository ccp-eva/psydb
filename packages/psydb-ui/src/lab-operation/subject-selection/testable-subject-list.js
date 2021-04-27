import React, { useState, useEffect, useReducer } from 'react';

import {
    Redirect,
    useRouteMatch,
    useParams
} from 'react-router-dom';

import {
    Table
} from 'react-bootstrap';

import agent from '@mpieva/psydb-ui-request-agents';
import datefns from '@mpieva/psydb-ui-lib/src/date-fns';
import up from '@mpieva/psydb-ui-lib/src/url-up';

import LoadingIndicator from '@mpieva/psydb-ui-lib/src/loading-indicator';

import {
    TableHead,
    TableBody
} from '@mpieva/psydb-ui-lib/src/record-list';

const reducer = (state, action) => {
    var { type, payload } = action;
    switch (type) {
        case 'init':
            return {
                ...state,
                isInitialized: true,
                records: payload.records,
                displayFieldData: payload.displayFieldData
            }
    }
}

const TestableSubjectList = ({
    userSearchSettings
}) => {
    var { path, url } = useRouteMatch();
    var { studyType, studyIds, subjectRecordType } = useParams();

    if (!userSearchSettings) {
        return (
            <Redirect to={`${up(url, 1)}`} />
        )
    }

    var [ state, dispatch ] = useReducer(reducer, {
        isInitialized: false,
    });

    var {
        isInitialized,
        records,
        displayFieldData,
    } = state;

    useEffect(
        () => {
            var {
                timeFrame,
                ageFrames,
                values,
            } = userSearchSettings

            agent.searchTestableSubjectsInhouse({
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
            .then((response) => {
                console.log(response);
                var {
                    records,
                    displayFieldData,
                    relatedRecords
                } = response.data.data;

                var studyIdsArray = studyIds.split(',');

                    /*displayFieldData.push({
                        key: studyId,
                        displayName: 'S',
                        dataPointer: `/_testableIn_${studyId}`,
                    })*/

                console.log(displayFieldData);

                dispatch({ type: 'init', payload: {
                    records,
                    displayFieldData
                }})
            })
        },
        [
            studyIds,
            subjectRecordType,
            userSearchSettings
        ]
    )
    
    if (!isInitialized) {
        return <LoadingIndicator size='lg' />
    }

    console.log(userSearchSettings);
    return (
        <Table>
            <TableHead 
                displayFieldData={ displayFieldData }
            />
            <TableBody
                records={ records }
                displayFieldData={ displayFieldData }
            />
        </Table>
    );
}

export default TestableSubjectList;
