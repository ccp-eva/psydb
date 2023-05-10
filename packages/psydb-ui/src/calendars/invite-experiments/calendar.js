import React, { useMemo } from 'react';

import {
    Route,
    Switch,
    Redirect,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import datefns from '@mpieva/psydb-ui-lib/src/date-fns';

import {
    useFetch,
    useRevision,
    usePermissions,
    useSelectionReducer,
} from '@mpieva/psydb-ui-hooks';

import {
    LoadingIndicator,
} from '@mpieva/psydb-ui-layout';

import {
    getDayStartsInInterval,
    withCalendarVariantContainer,
    CalendarNav,
    CalendarTeamLegend,
} from '@mpieva/psydb-ui-lib';

import DaysContainer from './days-container';

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
        selectedStudyId, teamSelection.value
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
        phoneListField,
    } = fetched.data;

    var experimentsByDayStart = (() => {
        var groups = {};
        for (var start of allDayStarts) {
            var startT = start.getTime();
            var endT = datefns.endOfDay(start).getTime();
            groups[startT] = [];
            if (experimentRecords) {
                groups[startT] = experimentRecords.filter(it => {
                    var expStartT = (
                        new Date(it.state.interval.start).getTime()
                    )
                    return (
                        expStartT >= startT
                        && expStartT <= endT
                    )
                })
            }
        }
        return groups;
    })();

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
                inviteType,

                allDayStarts,
                experimentsByDayStart,

                experimentRelated,
                experimentOperatorTeamRecords,
                subjectRecordsById,
                subjectRelated,
                subjectDisplayFieldData,

                url,
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
