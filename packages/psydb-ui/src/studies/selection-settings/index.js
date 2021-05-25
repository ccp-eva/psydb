import React, { useEffect, useReducer, useMemo } from 'react';

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
import SelectionSettingsBySubjectType from './selection-settings-by-subject-type';

const StudySelectionSettings = ({
    recordType,
}) => {
    var { path, url } = useRouteMatch();
    var { id } = useParams();

    var [ state, dispatch ] = useReducer(reducer, {});
    var {
        record,
        relatedRecordLabels,
        relatedHelperSetItems,
        relatedCustomRecordTypeLabels,
    } = state;

    useEffect(() => {
        agent.readRecord({
            collection: 'study',
            recordType,
            id,
        })
        .then((response) => {
            dispatch({ type: 'init', payload: {
                ...response.data.data
            }})
        })
    }, [ id ])

    if (!record) {
        return (
            <LoadingIndicator size='lg' />
        );
    }

    var { selectionSettingsBySubjectType } = record.state;

    return (
        <div>
            <SelectionSettingsBySubjectType
                record={ record }
                settings={ selectionSettingsBySubjectType }
            />
        </div>
    )
}

const reducer = (state, action) => {
    var { type, payload } = action;
    switch (type) {
        case 'init':
            return ({
                ...state,
                record: payload.record,
                relatedRecordLabels: payload.relatedRecordLabels,
                relatedHelperSetItems: payload.relatedHelperSetItems,
                relatedCustomRecordTypeLabels: payload.relatedCustomRecordTypeLabels,
            })
    }
}

export default StudySelectionSettings;
