import React, { useReducer, useEffect } from 'react';

import agent from '@mpieva/psydb-ui-request-agents';
import { Table } from '../record-list';
import LoadingIndicator from '../loading-indicator';

const StudySelectList = ({
    studyRecordType,
    experimentType,

    enableSelectRecords,
    showSelectionIndicator,
    selectedRecordIds,
    onSelectRecord,
   
}) => {
    var [ state, dispatch ] = useReducer(reducer, {});
    var {
        records,
        displayFieldData,
        relatedRecordLabels,
        relatedHelperSetItems,
        relatedCustomRecordTypeLabels,
    } = state;

    useEffect(() => {
        agent.fetchSelectableStudies({
            studyRecordType,
            experimentType
        })
        .then(response => {
            dispatch({ type: 'init', payload: {
                ...response.data.data
            }})
        })
    }, [ studyRecordType, experimentType ])

    if (!records) {
        return (
            <LoadingIndicator size='lg' />
        );
    }

    return (
        <Table { ...({
            records,
            displayFieldData,
            relatedRecordLabels,
            relatedHelperSetItems,
            relatedCustomRecordTypeLabels,

            enableSelectRecords,
            showSelectionIndicator,
            onSelectRecord,
            selectedRecordIds,
        })} />
    )
};

var reducer = (state, action) => {
    var { type, payload } = action;
    switch (type) {
        case 'init':
            return {
                ...state,
                records: payload.records,
                displayFieldData: payload.displayFieldData,
                relatedRecordLabels: payload.relatedRecordLabels,
                relatedHelperSetItems: payload.relatedHelperSetItems,
                relatedCustomRecordTypeLabels: payload.relatedCustomRecordTypeLabels,
            }
    }
}

export default StudySelectList;
