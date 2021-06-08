import React, { useReducer, useEffect, useMemo, useState } from 'react';

import {
    Route,
    Switch,
    Redirect,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import agent from '@mpieva/psydb-ui-request-agents';
import datefns from '@mpieva/psydb-ui-lib/src/date-fns';
import LoadingIndicator from '@mpieva/psydb-ui-lib/src/loading-indicator';
import CalendarNav from '@mpieva/psydb-ui-lib/src/calendar-nav';
import withVariableCalendarPages from '@mpieva/psydb-ui-lib/src/with-variable-calendar-pages';
import getDayStartsInInterval from '@mpieva/psydb-ui-lib/src/get-day-starts-in-interval';

import DaysContainer from './days-container';

const Calendar = ({
    currentPageStart,
    currentPageEnd,
    onPageChange,
}) => {
    var { path, url } = useRouteMatch();

    var {
        studyType,
        subjectType,
        researchGroupId,
    } = useParams();

    var [ state, dispatch ] = useReducer(reducer, {});

    var {
        experimentRecords,
        experimentOperatorTeamRecords,
        experimentRelated,
        subjectRecordsById,
        subjectRelated,
        subjectDisplayFieldData,
        phoneListField,

        listRevision,
    } = state;

    useEffect(() => {

        agent.fetchExperimentCalendar({
            subjectRecordType: subjectType,
            interval: {
                start: currentPageStart,
                end: currentPageEnd,
            },
            experimentType: 'inhouse',
        })
        .then(response => {
            dispatch({ type: 'init', payload: {
                ...response.data.data
            }})
        })

    }, [ 
        studyType, subjectType, researchGroupId,
        currentPageStart, currentPageEnd, listRevision
    ])

    var [
        handleChangeStatus
    ] = useMemo(() => ([
        ({ experimentRecord, subjectRecord, status }) => {
            var message = {
                type: 'experiment/change-invitation-status',
                payload: {
                    experimentId: experimentRecord._id,
                    subjectId: subjectRecord._id,
                    invitationStatus: status
                }
            }

            agent.send({ message })
            .then(response => {
                dispatch({ type: 'increase-list-revision'})
            })
        }
    ]), [])

    var allDayStarts = useMemo(() => (
        getDayStartsInInterval({
            start: currentPageStart,
            end: currentPageEnd
        })
    ), [ currentPageStart, currentPageEnd ]);

    var experimentsByDayStart = useMemo(() => {
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
    }, [ experimentRecords ])

    if (!experimentRecords) {
        return <LoadingIndicator size='lg' />
    }

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

                url,
            }) }/>

            { /*experimentRecords.map(it => (
                <InviteConfirmationListItem { ...({
                    key: it._id,
                    experimentRecord: it,

                    experimentOperatorTeamRecords,
                    experimentRelated,
                    subjectRecordsById,
                    subjectRelated,
                    subjectDisplayFieldData,
                    phoneListField,

                    onChangeStatus: handleChangeStatus,
                }) } />
            )) */}
        </div>
    )
}

const reducer = (state, action) => {
    var { type, payload } = action;
    switch (type) {
        case 'init':
            return {
                ...state,
                experimentRecords: payload.experimentRecords,
                experimentOperatorTeamRecords: payload.experimentOperatorTeamRecords,
                experimentRelated: payload.experimentRelated,
                subjectRecordsById: payload.subjectRecordsById,
                subjectRelated: payload.subjectRelated,
                subjectDisplayFieldData: payload.subjectDisplayFieldData,
                phoneListField: payload.phoneListField,

            }
        
        case 'increase-list-revision':
            return {
                ...state,
                listRevision: (state.listRevision || 0) + 1
            }
    }
}

const WrappedCalendar = (
    withVariableCalendarPages(Calendar)
);

const CalendarVariantContainer = (ps) => {
    var [ calendarVariant, setCalendarVariant ] = useState('3-day');
    return (
        <>
            <a onClick={ () => setCalendarVariant('daily') }>daily</a>
            {' '}
            <a onClick={ () => setCalendarVariant('weekly') }>weekly</a>
            {' '}
            <a onClick={ () => setCalendarVariant('3-day') }>3-day</a>
            <WrappedCalendar { ...({
                calendarVariant,
                ...ps
            }) } />
        </>
    )
}

export default CalendarVariantContainer;
