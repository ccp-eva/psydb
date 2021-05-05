import React, { useReducer, useEffect, useMemo } from 'react';

import {
    Route,
    Switch,
    Redirect,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import agent from '@mpieva/psydb-ui-request-agents';
import LoadingIndicator from '@mpieva/psydb-ui-lib/src/loading-indicator';
import CalendarNav from '@mpieva/psydb-ui-lib/src/calendar-nav';
import withDailyCalendarPages from '@mpieva/psydb-ui-lib/src/with-daily-calendar-pages';

import InviteConfirmationListItem from './invite-confirmation-list-item';

const InviteConfirmationList = ({
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
        agent.fetchInviteConfirmationList({
            subjectRecordType: subjectType,
            researchGroupId,
            start: currentPageStart,
            end: currentPageEnd,
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

            { experimentRecords.map(it => (
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
            )) }
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

const WrappedInviteConfirmationList = (
    withDailyCalendarPages(InviteConfirmationList)
);
export default WrappedInviteConfirmationList;
