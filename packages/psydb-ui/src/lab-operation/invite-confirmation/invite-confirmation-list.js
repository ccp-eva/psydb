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

import InviteConfirmationListItem from './invite-confirmation-list-item';

const InviteConfirmationList = () => {
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
            start: '2000-01-01T00:00:00.000Z',
            end: '2025-01-01T00:00:00.000Z',
        })
        .then(response => {
            dispatch({ type: 'init', payload: {
                ...response.data.data
            }})
        })
    }, [ studyType, subjectType, researchGroupId ])

    if (!experimentRecords) {
        return <LoadingIndicator size='lg' />
    }

    return (
        <div>
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

export default InviteConfirmationList;
