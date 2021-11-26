import React, { useState } from 'react';

import {
    useFetch,
    usePaginationReducer,
} from '@mpieva/psydb-ui-hooks';

import {
    Pagination,
    LoadingIndicator
} from '@mpieva/psydb-ui-layout';

export const AvailableStudies = (ps) => {
    var {
        studyType,
        selectedTopicId,
        onSelect,
    } = ps;

    var [ filters, setFilters ] = useState({});
    var pagination = usePaginationReducer({ offset: 0, limit: 50 })
    var { offset, limit } = pagination;

    var [ didFetch, fetched ] = useFetch((agent) => {
        return agent.searchRecords({
            target: 'optionlist',
            collection: 'study',
            recordType: studyType, 
            //searchOptions,
            offset,
            limit,
            constraints: {
                '/state/studyTopicIds': selectedTopicId
            },
            filters,
            //sort: defaultSort || undefined
        })
        .then((response) => {
            pagination.setTotal(response.data.data.recordsCount);
            return response;
        });
    }, [ studyType, offset, limit, filters, selectedTopicId ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { records } = fetched.data;

    return (
        <div>
            <div className='p-3 border bg-white'>
                { records.map(it => (
                    <div>{ it._recordLabel }</div>
                )) }
            </div>
            <Pagination
                { ...pagination }
                showTotal={ false }
                showLimit={ false }
            />
        </div>
    )
}
