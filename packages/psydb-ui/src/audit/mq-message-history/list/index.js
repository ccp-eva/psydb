import React from 'react';

import {
    usePaginationURLSearchParams,
    useFetch
} from '@mpieva/psydb-ui-hooks';

import {
    LoadingIndicator,
    Pagination,
    PageWrappers,
} from '@mpieva/psydb-ui-layout';

const List = () => {
    
    var { url } = useRouteMatch();
    var pagination = usePaginationURLSearchParams({ offset: 0, limit: 50 });
    var { offset, limit } = pagination;

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent
        .fetchMQMessageHistory({ offset, limit })
        .then((response) => {
            pagination.setTotal(response.data.data.total)
            return response;
        })
    ), [ offset, limit ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { updates, related } = fetched.data;

    return (
        'LIST'
    )
}

export default List;
