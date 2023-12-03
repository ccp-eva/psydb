import React from 'react';
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

const FixedAddEventList = (ps) => {

    var pagination = usePaginationURLSearchParams({ offset: 0, limit: 50 });
    var { offset, limit } = pagination;

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent
        .fetchFixedAddEventList({ offset, limit })
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
        <PageWrappers.Level1 title='Fixed Add-Events'>
            <PageWrappers.Level2 title='List'>
                <div className='sticky-top border-bottom'>
                    <Pagination
                        { ...pagination }
                        showJump={ false }
                    />
                </div>
            </PageWrappers.Level2>
        
            { updates.map((it, ix) => (
                <UpdateItem key={ ix } { ...it } related={ related } />
            ))}
        </PageWrappers.Level1>
    )
}

const UpdateItem = (ps) => {
    var {
        _id: updateId, source,
        correlationId, isOnlineSurvey,
        timestamp, ops,

        related
    } = ps;

    var style = {
        border: '1px solid #dee2e6',
        borderLeftWidth: '5px',
    }

    return (
        <div className='p-3 mt-2' style={ style }>
            <SplitPartitioned partitions={[ 1, 2 ]}>
                <div>
                    <Label125 text='Update ID' />{ updateId }<br />
                    <Label125 text='Correlation ID' />{ correlationId }<br />
                    <Label125 text='Timestamp' />{ timestamp }<br />
                    { isOnlineSurvey && (
                        <b className='d-block mt-3'>Is Online-Survey</b>
                    )}
                </div>
                <div>
                    <header className='border-bottom pb-1 mb-1'>
                        <b>Operations</b>
                    </header>
                    { ops.map((it, ix) => (
                        <OpsItem
                            key={ ix }
                            index={ ix }
                            { ...it }
                            related={ related }
                        />
                    ))}
                </div>
            </SplitPartitioned>
        </div>
    )
}

const OpsItem = (ps) => {
    var { index, op, collection, args, related } = ps;

    var { _id } = args[0];
    var label = related[collection] ? related[collection][_id] : '-';
    var href = {
        'subject': `/#/subjects/${_id}`,
        'experiment': `/#/experiments/${_id}`,
    }[collection];

    return (
        <SplitPartitioned partitions={[ 1,2,2,3,3 ]}>
            <b>{ index } </b>
            <span>{ op }</span>
            <span>{ collection }</span>
            <span>{ label }</span>
            <a href={ href }>
                { _id }
            </a>
        </SplitPartitioned>
    )
}

const Label125 = (ps) => (
    <b
        className={ `d-inline-block ${ps.className}`}
        style={{ minWidth: '125px' }}
    >
        { ps.text }
    </b>
)

export default FixedAddEventList;
