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
    onSelectReservationSlot,
    onSelectExperimentSlot,

    /*currentPageStart,
    currentPageEnd,
    onPageChange,*/

    locationCalendarListClassName,

    // used to force reloading the whole component
    revision = 0,

    // used to force update of the calendar
    calendarRevision = 0,
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

    }, [ studyId, studyRecordType, revision ])

    if (!(customRecordTypeData && studyRecord && teamRecords )) {
        return (
            <LoadingIndicator size='lg' />
        )
    }

    if (!activeLocationType) {
        activeLocationType = (
            studyRecord.state
            .inhouseTestLocationSettings[0].customRecordType
        )
    }

    console.log('L', locationCalendarListClassName);

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
                className={ locationCalendarListClassName }
                teamRecords={ teamRecords }
                studyId={ studyId }
                locationRecordType={ activeLocationType }

                onSelectEmptySlot={ onSelectEmptySlot }
                onSelectReservationSlot={ onSelectReservationSlot }
                onSelectExperimentSlot={ onSelectExperimentSlot }

                revision={ calendarRevision }
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
