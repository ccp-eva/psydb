import React from 'react';

import {
    gatherLocationsFromLabProcedureSettings
} from '@mpieva/psydb-common-lib';

import { useFetchAll } from '@mpieva/psydb-ui-hooks';
import { LoadingIndicator, TabNav } from '@mpieva/psydb-ui-layout';

import LocationCalendarList from './location-calendar-list';


const StudyInhouseLocations = ({
    variant = 'experiment',
    studyId,
    studyRecordType,

    subjectRecordType,
    currentExperimentId,
    currentExperimentType,
    currentSubjectRecord,
    
    desiredTestInterval,
    testableIntervals,

    activeLocationType,
    onSelectLocationType,

    __useNewCanSelect,
    checkEmptySlotSelectable,
    checkReservationSlotSelectable,
    checkExperimentSlotSelectable,

    onSelectEmptySlot,
    onSelectReservationSlot,
    onSelectExperimentSlot,

    calculateNewExperimentMaxEnd,

    /*currentPageStart,
    currentPageEnd,
    onPageChange,*/

    locationCalendarListClassName,

    // used to force reloading the whole component
    revision = 0,

    // used to force update of the calendar
    calendarRevision = 0,
}) => {
    
    var [ didFetch, fetched, isTransmitting ] = useFetchAll((agent) => ({
        customTypes: agent.readCustomRecordTypeMetadata(),
        /*study:  agent.readRecord({
            collection: 'study',
            recordType: studyRecordType,
            id: studyId,
        }),*/
        teams: agent.fetchExperimentOperatorTeamsForStudy({
            studyId,
        }),
        settings: agent.fetchExperimentVariantSettings({
            studyId,
        }),
    }), [ studyId, studyRecordType, activeLocationType, revision ])

    if (!didFetch || isTransmitting) {
        return (
            <LoadingIndicator size='lg' />
        )
    }

    var customRecordTypeData = fetched.customTypes.data.customRecordTypes;
    //var studyRecord = fetched.study.data.record;
    var teamRecords = fetched.teams.data.records;

    var {
        records: settingRecords,
        ...settingRelated
    } = fetched.settings.data;

    var locations = gatherLocationsFromLabProcedureSettings({
        settingRecords
    });

    var tabs = Object.keys(locations).map(type => ({
        key: type,
        label: (
            settingRelated.relatedCustomRecordTypes.location[type]
            .state.label
        )
    }))

    if (!activeLocationType) {
        activeLocationType = Object.keys(locations)[0];
    }

    //console.log('L', locationCalendarListClassName);

    return (
        <>
            <TabNav
                items={ tabs }
                activeKey={ activeLocationType }
                onItemClick={ onSelectLocationType }
            />

            <LocationCalendarList { ...({
                variant,
                className: locationCalendarListClassName,
                teamRecords,
                studyId,

                settingRecords,
                settingRelated,
                
                currentExperimentId,
                currentExperimentType,
                subjectRecordType,
                currentSubjectRecord,
                desiredTestInterval,
                testableIntervals,

                locationRecordType: activeLocationType,

                __useNewCanSelect,
                checkEmptySlotSelectable,
                checkReservationSlotSelectable,
                checkExperimentSlotSelectable,

                onSelectEmptySlot,
                onSelectReservationSlot,
                onSelectExperimentSlot,

                calculateNewExperimentMaxEnd,

                revision: calendarRevision,
            })} />
        </>
    )
}

export default StudyInhouseLocations;
