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
        revision,

        record,
        subjectTypeData,
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
            dispatch({ type: 'init-data', payload: {
                ...response.data.data
            }})
        })

        agent.fetchSubjectTypeDataForStudy({
            studyId: id,
        })
        .then((response) => {
            dispatch({ type: 'init-subject-type-data', payload: {
                ...response.data.data
            }})
        })

    }, [ id, revision ])

    if (!record || !subjectTypeData) {
        return (
            <LoadingIndicator size='lg' />
        );
    }

    var { selectionSettingsBySubjectType } = record.state;

    return (
        <div>
            <SelectionSettingsBySubjectType { ...({
                settings: selectionSettingsBySubjectType,

                record,
                subjectTypeData,
                relatedRecordLabels,
                relatedHelperSetItems,
                relatedCustomRecordTypeLabels,
            }) } />
        </div>
    )
}

const reducer = (state, action) => {
    var { type, payload } = action;
    switch (type) {

        case 'init-data':
            return ({
                ...state,
                record: payload.record,
                relatedRecordLabels: payload.relatedRecordLabels,
                relatedHelperSetItems: payload.relatedHelperSetItems,
                relatedCustomRecordTypeLabels: payload.relatedCustomRecordTypeLabels,
            })

        case 'init-subject-type-data':
            return ({
                ...state,
                subjectTypeData: payload.records,
            })

    }
}

export default StudySelectionSettings;
