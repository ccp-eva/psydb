import React from 'react';

import {
    useFetch,
    useRevision,
    useSelectionReducer,
} from '@mpieva/psydb-ui-hooks';

import {
    LoadingIndicator,
} from '@mpieva/psydb-ui-layout';

import {
    groupRecordsByDayStarts,
    getDayStartsInInterval,
    withCalendarVariantContainer,
    CalendarNav,
    CalendarTeamLegend,

    withExperimentCalendarDays,
    InviteExperimentSummary
} from '@mpieva/psydb-ui-lib';

const DaysContainer = withExperimentCalendarDays({
    ExperimentSummaryDaily: InviteExperimentSummary.Medium,
    ExperimentSummary3Day: InviteExperimentSummary.Medium,
    ExperimentSummaryWeekly: InviteExperimentSummary.Small,
})

// FIXME: better name for this component
const InviteCalendarBody = (ps) => {
    var {
        locationId,
        experimentTypes,

        currentPageStart,
        currentPageEnd,
        showPast,
        onPageChange,

        calendarVariant,
        selectedStudyId,
        onSelectDay,
    } = ps;

    var revision = useRevision();
    var teamSelection = useSelectionReducer();
    
    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.fetchExperimentCalendar({
            experimentTypes,
            locationId,
            interval: {
                start: currentPageStart,
                end: currentPageEnd,
            },
            ...(selectedStudyId && {
                studyId: selectedStudyId
            }),
            experimentOperatorTeamIds: (
                teamSelection.value.length > 0
                ? teamSelection.value
                : undefined
            ),
            showPast,
        })
    ), [ 
        currentPageStart, currentPageEnd, revision.value,
        selectedStudyId, teamSelection.value.join(',')
    ])
    
    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var {
        studyRecords,
        experimentRecords,
        experimentOperatorTeamRecords,
        experimentRelated,
        subjectRecordsById,
        subjectRelated,

        subjectDisplayFieldData,
    } = fetched.data;

    var allDayStarts = getDayStartsInInterval({
        start: currentPageStart,
        end: currentPageEnd
    })

    var experimentsByDayStart = groupRecordsByDayStarts({
        interval: { start: currentPageStart, end: currentPageEnd },
        records: experimentRecords,
        timestampPointer: '/state/interval/start'
    });

    return (
        <div>
            <CalendarNav { ...({
                className: 'mt-3',
                currentPageStart,
                currentPageEnd,
                onPageChange,
            })} />
            
            <hr className='mt-1 mb-3' style={{
                marginLeft: '15em',
                marginRight: '15em',
            }}/>
            
            <DaysContainer { ...({
                allDayStarts,
                experimentsByDayStart,

                experimentRelated,
                experimentOperatorTeamRecords,
                subjectRecordsById,
                subjectRelated,
                subjectDisplayFieldData,

                calendarVariant,
                showPast,
                onSelectDay,
                onSuccessfulUpdate: revision.up
            }) }/>
            
            <CalendarTeamLegend { ...({
                studyRecords,
                experimentOperatorTeamRecords,
                activeTeamIds: teamSelection.value,
                onClickTeam: (team) => {
                    teamSelection.toggle(team._id)
                }
            })} />
        </div>
    )
}

const InviteCalendar = (
    withCalendarVariantContainer({ Calendar: InviteCalendarBody })
);

export { InviteCalendar }
