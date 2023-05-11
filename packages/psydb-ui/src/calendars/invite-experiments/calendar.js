import React, { useMemo } from 'react';

import {
    Route,
    Switch,
    Redirect,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

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

const Calendar = (ps) => {
    var {
        inviteType,

        currentPageStart,
        currentPageEnd,
        onPageChange,
        selectedStudyId,
        calendarVariant,
        showPast,
        onSelectDay,
    } = ps;

    var { path, url } = useRouteMatch();

    var {
        studyType,
        subjectType,
        researchGroupId,
    } = useParams();

    var revision = useRevision();
    var teamSelection = useSelectionReducer();

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.fetchExperimentCalendar({
            subjectRecordType: subjectType,
            interval: {
                start: currentPageStart,
                end: currentPageEnd,
            },
            experimentType: inviteType,
            ...(selectedStudyId && {
                studyId: selectedStudyId
            }),
            researchGroupId,

            experimentOperatorTeamIds: (
                teamSelection.value.length > 0
                ? teamSelection.value
                : undefined
            ),
            showPast,
        })
    ), [ 
        studyType, subjectType, researchGroupId,
        currentPageStart, currentPageEnd, revision.value,
        selectedStudyId, teamSelection.value.join(',')
    ])

    var allDayStarts = useMemo(() => (
        getDayStartsInInterval({
            start: currentPageStart,
            end: currentPageEnd
        })
    ), [ currentPageStart, currentPageEnd ]);

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
                //inviteType,

                allDayStarts,
                experimentsByDayStart,

                experimentRelated,
                experimentOperatorTeamRecords,
                subjectRecordsById,
                subjectRelated,
                subjectDisplayFieldData,

                //url,
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

const CalendarVariantContainer= (
    withCalendarVariantContainer({ Calendar })
);

export default CalendarVariantContainer;
