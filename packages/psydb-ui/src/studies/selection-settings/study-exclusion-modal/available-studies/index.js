import React, { useState } from 'react';

import {
    useFetch,
    usePaginationReducer,
    useSelectionReducer,
} from '@mpieva/psydb-ui-hooks';

import {
    Pagination,
    LoadingIndicator
} from '@mpieva/psydb-ui-layout';

import { QuickSearch } from './quick-search';
import { List } from './list';

export const AvailableStudies = (ps) => {
    var {
        excludedStudyIds,
        selectedTopicIds,
        onSelect,
    } = ps;

    var [ query, updateQuery ] = useState({ nameOrShorthand: undefined });
    var pagination = usePaginationReducer({ offset: 0, limit: 50 })
    var { offset, limit } = pagination;

    var [ didFetch, fetched ] = useFetch((agent) => {
        return agent.getAxios().post('/api/search-studies-for-exclusion', {
            ...query,
            selectedTopicIds,
            excludedStudyIds,
        })
        .then((response) => {
            pagination.setTotal(response.data.data.recordsCount);
            return response;
        });
    }, [ offset, limit, query, selectedTopicIds, excludedStudyIds ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { records } = fetched.data;

    return (
        <div className='d-flex flex-column flex-grow'>
            <QuickSearch
                className='pb-2'
                searchValues={ query }
                onSubmit={ (next) => {
                    updateQuery(next)
                }}
            />
            <div className='border bg-white flex-grow'>
                <List { ...({
                    records,
                    onSelect
                })} />
            </div>
            <Pagination
                { ...pagination }
                extraClassName='border-bottom'
                showTotal={ false }
                showLimit={ false }
            />
        </div>
    )
}

