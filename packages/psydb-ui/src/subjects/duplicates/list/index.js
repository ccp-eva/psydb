import React from 'react';
import { useFetch } from '@mpieva/psydb-ui-hooks';
import { LoadingIndicator } from '@mpieva/psydb-ui-layout';

const DuplicatesList = (ps) => {
    var { recordType } = ps;
    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.subject.listDuplicates({
            recordType,
            inspectedPointers: [ '/gdpr/state/custom/lastname' ]
        })
    ), [ recordType ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var {
        aggregateItems,
        inspectedFields,
        related
    } = fetched.data;

    var sharedBag = { inspectedFields, related };
    return (
        <div>
            { aggregateItems.map((it, ix) => (
                <DuplicateGroup key={ ix } items={ it } { ...sharedBag} />
            ))}
        </div>
    )

}

const DuplicateGroup = (ps) => {
    var { items, inspectedFields, related } = ps;

    var sharedBag = { inspectedFields, related };
    return (
        <div className='bg-light px-3 py-2 border'>
            { items.map((it, ix) => (
                <DuplicateItem key={ ix } item={ it } { ...sharedBag } />
            ))}
        </div>
    )
}

const DuplicateItem = (ps) => {
    var { item, inspectedFields, related } = ps;

    return (
        <div>
            { item._label }
        </div>
    )
}

export default DuplicatesList;
