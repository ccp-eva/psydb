import React, { useEffect, useReducer, useMemo } from 'react';

import {
    Redirect,
    useRouteMatch,
    useParams
} from 'react-router-dom';

import {
    Table
} from 'react-bootstrap';

import { Base64 } from 'js-base64';

import agent from '@mpieva/psydb-ui-request-agents';
import datefns from '@mpieva/psydb-ui-lib/src/date-fns';
import up from '@mpieva/psydb-ui-lib/src/url-up';

import LoadingIndicator from '@mpieva/psydb-ui-lib/src/loading-indicator';

import {
    TableHead,
    TableBody
} from '@mpieva/psydb-ui-lib/src/record-list';

import SubjectModal from './subject-modal';

const OnlineTestableSubjectList = ({
    studyLabelItems,
}) => {
    var { path, url } = useRouteMatch();
    var {
        studyType,
        studyIds,
        subjectRecordType,
        searchSettings64
    } = useParams();

    var userSearchSettings = JSON.parse(Base64.decode(searchSettings64));

    if (!userSearchSettings) {
        return (
            <Redirect to={`${up(url, 1)}`} />
        )
    }

    var [ state, dispatch ] = useReducer(reducer, {});

    var {
        records,
        displayFieldData,
        relatedRecordLabels,
        relatedHelperSetItems,
        relatedCustomRecordTypeLabels,

        showSubjectModal,
        subjectModalData,
        listRevision,
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
                dispatch({ type: 'init', payload: {
                    ...response.data.data
                }});
            })
        }, [ studyIds, subjectRecordType, searchSettings64 ]
    )
    
    var [
        handleShowSubjectModal,
        handleHideSubjectModal,
        
        handleSubjectSelected,
    ] = useMemo(() => ([
        (selectedRecord) => dispatch({ type: 'show-subject-modal', payload: {
            record: selectedRecord
        }}),
        () => dispatch({ type: 'hide-subject-modal' }),

        () => dispatch({ type: 'increase-list-revision' }),
    ]));

    if (!records) {
        return <LoadingIndicator size='lg' />
    }

    return (
        <>
            <SubjectModal
                show={ showSubjectModal }
                onHide={ handleHideSubjectModal }
                
                studyNavItems={ studyLabelItems }
                studyRecordType={ studyType }
                
                subjectRecordType={ subjectRecordType }
                subjectModalData={ subjectModalData }
            />
            <Table hover>
                <TableHead 
                    displayFieldData={ displayFieldData }
                />
                <TableBody { ...({
                    records,
                    displayFieldData,
                    relatedRecordLabels,
                    relatedHelperSetItems,

                    onSelectRecord: handleShowSubjectModal,

                    CustomActionListComponent: () => {
                        return <div>FOO</div>
                    }
                }) } />
            </Table>
        </>
    );
}

const reducer = (state, action) => {
    var { type, payload } = action;
    switch (type) {
        case 'init':
            var {
                records,
                relatedRecordLabels,
                relatedHelperSetItems,
                relatedCustomRecordTypeLabels,
                displayFieldData,
            } = payload;

            displayFieldData.push({
                key: '_testableInStudies',
                displayName: 'Mögliche Studien',
                type: 'ForeignIdList',
                props: {
                    collection: 'study',
                },
                dataPointer: '/_testableInStudies'
            })

            return {
                ...state,
                records,
                relatedRecordLabels,
                relatedHelperSetItems,
                relatedCustomRecordTypeLabels,
                displayFieldData,
            }

        case 'show-subject-modal':
            return {
                ...state,
                showSubjectModal: true,
                subjectModalData: payload
            }
        case 'hide-subject-modal':
            return {
                ...state,
                showSubjectModal: false,
            }

        case 'increase-list-revision':
            return {
                ...state,
                listRevision: (state.listRevision || 0) + 1
            }
    }
}
        
export default OnlineTestableSubjectList;
