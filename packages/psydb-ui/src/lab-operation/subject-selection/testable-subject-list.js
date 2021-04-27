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

import InhouseSelectionModal from './inhouse-selection-modal';

const reducer = (state, action) => {
    var { type, payload } = action;
    switch (type) {
        case 'init':
            return {
                ...state,
                isInitialized: true,
                ...payload,
            }
    }
}

const TestableSubjectList = ({
    studyLabelItems,
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
        relatedRecords,
        relatedHelperSetItems,
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
                    relatedRecords,
                    relatedHelperIdItems,
                } = response.data.data;


                displayFieldData.push({
                    key: '_testableInStudies',
                    displayName: 'Mögliche Studien',
                    type: 'ForeignIdList',
                    props: {
                        collection: 'study',
                    },
                    dataPointer: '/_testableInStudies'
                })

                dispatch({ type: 'init', payload: {
                    records,
                    displayFieldData,
                    relatedRecords,
                    relatedHelperIdItems,
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
    console.log(relatedRecords);
    return (
        <>
            <InhouseSelectionModal
                show={ true }
                studyNavItems={ studyLabelItems }
            />
            <Table hover>
                <TableHead 
                    displayFieldData={ displayFieldData }
                />
                <TableBody { ...({
                    records,
                    displayFieldData,
                    relatedRecords,
                    relatedHelperSetItems,

                    onSelectRecord: (record) => {
                        console.log(args);
                        dispatch({
                            type: 'open-modal',
                            payload: record._id,
                        })
                    }
                }) } />
            </Table>
        </>
    );
}

export default TestableSubjectList;
