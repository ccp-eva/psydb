import React from 'react';
import { useFetchAll } from '@mpieva/psydb-ui-hooks';
import { LoadingIndicator } from '@mpieva/psydb-ui-layout';

import { LocationTypeNav } from './location-type-nav';
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
        });

        var settings = agent.fetchExperimentVariantSettings({
            studyId,
        });

        var promises = {
            customTypes,
            study,
            teams,
            settings,
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

    var {
        records: settingRecords,
        ...settingRelated
    } = fetched.settings.data;

    if (!activeLocationType) {
        var firstSetting = settingRecords.find(it => (
            ['inhouse', 'online-video-call'].includes(it.type)
            && it.state.locations.length > 0
        ));

        activeLocationType = (
            firstSetting.state.locations[0].customRecordTypeKey
        );
    }

    //console.log('L', locationCalendarListClassName);

    return (
        <>
            <LocationTypeNav
                settingRecords={ settingRecords }
                settingRelated={ settingRelated }
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
