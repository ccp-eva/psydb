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

import CalRangePillNav from '../cal-range-pill-nav';
import StudyPillNav from '../study-pill-nav';

import DaysContainer from './days-container';

const Calendar = ({
    currentPageStart,
    currentPageEnd,
    onPageChange,
    selectedStudyId,
    calendarVariant,
    onSelectDay,
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
            ...(selectedStudyId && {
                studyId: selectedStudyId
            })
        })
        .then(response => {
            dispatch({ type: 'init', payload: {
                ...response.data.data
            }})
        })

    }, [ 
        studyType, subjectType, researchGroupId,
        currentPageStart, currentPageEnd, listRevision,
        selectedStudyId,
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
                calendarVariant,
                onSelectDay,
            }) }/>
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
    withVariableCalendarPages(Calendar, { withURLSearchParams: true })
);

import { useURLSearchParams } from '@cdxoo/react-router-url-search-params';
import omit from '@cdxoo/omit';

const CalendarVariantContainer = (ps) => {
    var [ query, updateQuery ] = useURLSearchParams();
    
    var {
        cal: calendarVariant,
        study: selectedStudyId,
    } = query;

    calendarVariant = calendarVariant || '3-day';
    selectedStudyId = selectedStudyId || null;

    return (
        <>

            <div className='d-flex mb-2'>
                <div style={{ width: '100px', paddingTop: '.2rem' }}>
                    <b>Ansicht</b>
                </div>
                <div className='flex-grow'>
                    <CalRangePillNav { ...({
                        selectedVariant: calendarVariant,
                        onSelectVariant: (next) => updateQuery({
                            ...query, cal: next
                        })
                    }) } />
                </div>
            </div>

            <div className='d-flex mb-2'>
                <div style={{ width: '100px', paddingTop: '.2rem' }}>
                    <b>Studien</b>
                </div>
                <div className='flex-grow'>
                    <StudyPillNav { ...({
                        subjectRecordType: ps.subjectRecordType,
                        experimentType: 'inhouse',
                        selectedStudyId,
                        onSelectStudy: (next) => {
                            if (next) {
                                updateQuery({
                                    ...query, study: next
                                })
                            }
                            else {
                                updateQuery(omit('study', query));
                            }
                        }
                    }) } />

                </div>
            </div>
            
            <WrappedCalendar { ...({
                calendarVariant,
                selectedStudyId,
                //onSelectStudy: handleSelectStudyId,
                onSelectDay: (date) => {
                    updateQuery({
                        ...query,
                        cal: 'daily',
                        d: date.getTime()
                    })
                },
                ...ps
            }) } />
        </>
    )
}

export default CalendarVariantContainer;
