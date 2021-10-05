import React, { useReducer, useEffect } from 'react';

import agent from '@mpieva/psydb-ui-request-agents';
import { Table } from '../record-list';
import { LoadingIndicator } from '@mpieva/psydb-ui-layout';

import { useFetch } from '@mpieva/psydb-ui-hooks';

const StudySelectList = ({
    studyRecordType,
    experimentType,

    enableSelectRecords,
    showSelectionIndicator,
    wholeRowIsClickable,
    selectedRecordIds,
    onSelectRecord,
   
}) => {
    var [ didFetch, fetched ] = useFetch((agent) => {
        return agent.fetchSelectableStudies({
            studyRecordType,
            experimentType
        })
    }, [ studyRecordType, experimentType ]);

    if (!didFetch) {
        return (
            <LoadingIndicator size='lg' />
        );
    }

    var {
        records,
        displayFieldData,
        relatedRecordLabels,
        relatedHelperSetItems,
        relatedCustomRecordTypeLabels,
    } = fetched.data;

    return (
        <Table { ...({
            records,
            displayFieldData,
            relatedRecordLabels,
            relatedHelperSetItems,
            relatedCustomRecordTypeLabels,

            enableSelectRecords,
            showSelectionIndicator,
            wholeRowIsClickable,
            onSelectRecord,
            selectedRecordIds,
        })} />
    )
};

export default StudySelectList;
