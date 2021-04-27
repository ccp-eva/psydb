import React, { useMemo, useEffect, useReducer } from 'react';

import agent from '@mpieva/psydb-ui-request-agents';

import LoadingIndicator from '../loading-indicator';
import StudyInhouseLocationTypeNav from '../study-inhouse-location-type-nav';
import LocationCalendarList from './location-calendar-list';

const StudyInhouseLocations = ({
    studyId,
    studyRecordType,

    activeLocationType,
    onSelectLocationType,

    onSelectEmptySlot,
    onSelectReservedSlot,
    onSelectExperimentSlot,

    /*currentPageStart,
    currentPageEnd,
    onPageChange,*/
}) => {
    
    var [ state, dispatch ] = useReducer(reducer, {});
    
    var {
        customRecordTypeData,
        studyRecord,
        teamRecords,
    } = state;

    useEffect(() => {
        
        agent.readCustomRecordTypeMetadata()
        .then(response => {
            dispatch({ type: 'init-custom-record-type-data', payload: {
                customRecordTypeData: response.data.data.customRecordTypes,
            }})
        });

        agent.readRecord({
            collection: 'study',
            recordType: studyRecordType,
            id: studyId,
        })
        .then(response => {
            dispatch({ type: 'init-study', payload: {
                studyRecord: response.data.data.record,
            }})
        });

        agent.fetchExperimentOperatorTeamsForStudy({
            studyId,
        })
        .then(response => {
            dispatch({ type: 'init-teams', payload: {
                teamRecords: response.data.data.records,
            }})
        });

    }, [ studyId, studyRecordType ])

    if (!(customRecordTypeData && studyRecord && teamRecords )) {
        return (
            <LoadingIndicator size='lg' />
        )
    }

    return (
        <>
            <StudyInhouseLocationTypeNav
                studyRecord={ studyRecord }
                customRecordTypeData={ customRecordTypeData }
                activeType={ activeLocationType }
                onSelect={ (nextType) => {
                    onSelectLocationType(nextType);
                }}
            />
            <LocationCalendarList
                teamRecords={ teamRecords }
                studyId={ studyId }
                locationRecordType={ activeLocationType }
            />
        </>
    )
}

const reducer = (state, action) => {
    var { type, payload } = action;
    switch (type) {
        case 'init-custom-record-type-data':
            return {
                ...state,
                customRecordTypeData: payload.customRecordTypeData,
            }
        case 'init-study':
            return {
                ...state,
                studyRecord: payload.studyRecord
            };
        case 'init-teams':
            return {
                ...state,
                teamRecords: payload.teamRecords
            }
    }
}

export default StudyInhouseLocations;
