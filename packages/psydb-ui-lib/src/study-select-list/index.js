import React, { useReducer, useEffect } from 'react';

import agent from '@mpieva/psydb-ui-request-agents';
import { Table } from '../record-list';
import { LoadingIndicator } from '@mpieva/psydb-ui-layout';

import { useFetch } from '@mpieva/psydb-ui-hooks';

const StudySelectList = ({
    studyRecordType,
    experimentType,
    experimentTypes,

    target,
    className,

    enableSelectRecords,
    showSelectionIndicator,
    wholeRowIsClickable,
    selectedRecordIds,
    onSelectRecord,

    bsTableProps,
    CustomActionListComponent,
}) => {
    var [ didFetch, fetched ] = useFetch((agent) => {
        return agent.fetchSelectableStudies({
            studyRecordType,
            experimentType,
            experimentTypes,
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

            target,
            className,

            enableSelectRecords,
            showSelectionIndicator,
            wholeRowIsClickable,
            onSelectRecord,
            selectedRecordIds,
    
            bsTableProps,
            CustomActionListComponent,
        })} />
    )
};

export default StudySelectList;
