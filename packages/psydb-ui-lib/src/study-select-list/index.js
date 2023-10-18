import React, { useReducer, useEffect, useState } from 'react';

import { LoadingIndicator } from '@mpieva/psydb-ui-layout';
import { useFetch } from '@mpieva/psydb-ui-hooks';

import { Table } from '../record-list';
import { QuickSearch } from './quick-search';

const StudySelectList = (ps) => {
    var {
        studyRecordType,
        experimentType,
        experimentTypes,

        target,
        className,
        emptyInfoText,

        enableSelectRecords,
        showSelectionIndicator,
        wholeRowIsClickable,
        selectedRecordIds,
        onSelectRecord,

        bsTableProps,
        CustomActionListComponent,
    } = ps;
    var [ query, updateQuery ] = useState({});

    var [ didFetch, fetched ] = useFetch((agent) => {
        return agent.fetchSelectableStudies({
            studyRecordType,
            experimentType,
            experimentTypes,
            target,
            filters: query
        })
    }, [ studyRecordType, experimentType, query ]);

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

    var quickSearchClassName = (
        target === 'optionlist'
        ? 'mb-n2 mt-2'
        : 'bg-light px-3 pt-2 border-top mt-3'
    );

    return (
        <>
            <div className={ quickSearchClassName }>
                <QuickSearch
                    className='pb-2'
                    displayFieldData={ displayFieldData }
                    searchValues={ query }
                    onSubmit={ (next) => {
                        updateQuery(next)
                    }}
                />
            </div>
            <Table { ...({
                records,
                displayFieldData,
                relatedRecordLabels,
                relatedHelperSetItems,
                relatedCustomRecordTypeLabels,

                target,
                className,
                emptyInfoText,

                enableSelectRecords,
                showSelectionIndicator,
                wholeRowIsClickable,
                onSelectRecord,
                selectedRecordIds,
        
                bsTableProps,
                CustomActionListComponent,
            })} />
        </>
    )
};

export default StudySelectList;
