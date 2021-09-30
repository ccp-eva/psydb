import React from 'react';
import { useFetchAll } from '@mpieva/psydb-ui-hooks';

import LoadingIndicator from '../loading-indicator';
import StudyInhouseLocationTypeNav from '../study-inhouse-location-type-nav';
import LocationCalendarList from './location-calendar-list';


const StudyInhouseLocations = ({
    studyId,
    studyRecordType,

    subjectRecordType,

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
    
    var [ didFetch, fetched ] = useFetchAll((agent) => {
        var customTypes = agent.readCustomRecordTypeMetadata();
        
        var study = agent.readRecord({
            collection: 'study',
            recordType: studyRecordType,
            id: studyId,
        });
        
        var teams = agent.fetchExperimentOperatorTeamsForStudy({
            studyId,
        })

        var promises = {
            customTypes,
            study,
            teams
        };
        return promises;
    }, [ studyId, studyRecordType, activeLocationType, revision ])

    if (!didFetch) {
        return (
            <LoadingIndicator size='lg' />
        )
    }

    var customRecordTypeData = fetched.customTypes.data.customRecordTypes;
    var studyRecord = fetched.study.data.record;
    var teamRecords = fetched.teams.data.records;

    if (!activeLocationType) {
        activeLocationType = (
            studyRecord.state
            .inhouseTestLocationSettings[0].customRecordType
        )
    }

    //console.log('L', locationCalendarListClassName);

    return (
        <>
            <StudyInhouseLocationTypeNav
                studyRecord={ studyRecord }
                customRecordTypeData={ customRecordTypeData }
                activeType={ activeLocationType }
                onSelect={ onSelectLocationType }
            />
            <LocationCalendarList { ...({
                className: locationCalendarListClassName,
                teamRecords,
                studyRecord,
                
                subjectRecordType,
                locationRecordType: activeLocationType,

                onSelectEmptySlot,
                onSelectReservationSlot,
                onSelectExperimentSlot,

                revision: calendarRevision,
            })} />
        </>
    )
}

export default StudyInhouseLocations;
