import React from 'react';
import { useRouteMatch } from 'react-router';

import {
    usePaginationURLSearchParams,
    useFetch
} from '@mpieva/psydb-ui-hooks';

import {
    LoadingIndicator,
    Pagination,
    PageWrappers,
    SplitPartitioned,
} from '@mpieva/psydb-ui-layout';

import { urlUp } from '@mpieva/psydb-ui-utils';

import {
    UpdateSummary,
    OpsList
} from '../shared-utils';

const FixedPatchEventList = (ps) => {

    var { url } = useRouteMatch();
    var pagination = usePaginationURLSearchParams({ offset: 0, limit: 50 });
    var { offset, limit } = pagination;

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent
        .fetchFixedPatchEventList({ offset, limit })
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
        <PageWrappers.Level1
            title='Fixed Patch-Events'
            titleLinkUrl={ urlUp(url, 1) }
        >
            <PageWrappers.Level2 title='List'>
                <div className='sticky-top border-bottom'>
                    <Pagination
                        { ...pagination }
                        showJump={ true }
                    />
                </div>
            </PageWrappers.Level2>
        
            { updates.map((it, ix) => (
                <UpdateItem
                    key={ ix }
                    update={ it }
                    related={ related }
                />
            ))}
        </PageWrappers.Level1>
    )
}

const UpdateItem = (ps) => {
    var { update, related } = ps;

    var {
        _id: updateId, source,
        correlationId, isOnlineSurvey,
        timestamp, ops,

    } = update;
    
    var { url } = useRouteMatch();

    var style = {
        border: '1px solid #dee2e6',
        borderLeftWidth: '5px',
    }

    return (
        <div className='p-3 mt-2' style={ style }>
            <SplitPartitioned partitions={[ 1, 3 ]}>
                <UpdateSummary
                    update={ update }
                    href={ `#${url}/${updateId}` }
                />
                <OpsList
                    title='Operations'
                    ops={ ops }
                    related={ related }
                />
            </SplitPartitioned>
        </div>
    )
}

export default FixedPatchEventList;
