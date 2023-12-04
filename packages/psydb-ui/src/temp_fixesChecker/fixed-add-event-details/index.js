import React from 'react';
import { useParams } from 'react-router';
import { useFetch } from '@mpieva/psydb-ui-hooks';

import {
    LoadingIndicator,
    PageWrappers,
    SplitPartitioned,
} from '@mpieva/psydb-ui-layout';

var findId = ({ ops, collection }) => (
    ops.find(it => it.collection === collection)?.args[0]?._id
)

const FixedAddEventDetails = () => {
    var { id } = useParams();

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.fetchFixedAddEventDetails({ updateId: id })
    ), [ id ]);
    
    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { update } = fetched.data;
    var { ops } = update;

    var experimentId = findId({ ops, collection: 'experiment' });
    var subjectId = findId({ ops, collection: 'subject' });

    return (
        <PageWrappers.Level1 title='Fixed Add-Events'>
            <PageWrappers.Level2 title='List'>
                { experimentId && (
                    <SpooledExperiment id={ experimentId } />
                )}
            </PageWrappers.Level2>
        </PageWrappers.Level1>
    )
}

const SpooledExperiment = (ps) => {
    var { id } = ps;

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.fetchSpooledRecord({ collection: 'experiment', id })
    ), [ id ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { record, spooled, eventChain } = fetched.data;

    return (
        <SplitPartitioned partitions={[1,1,1]}>
            <div>
                <b>Event Chain</b>
                <pre className='bg-light p-3 border'>
                    { JSON.stringify(eventChain, null, 4) }
                </pre>
            </div>
            <div>
                <b>Cached Record</b>
                <pre className='bg-light p-3 border'>
                    { JSON.stringify(record.state, null, 4) }
                </pre>
            </div>
            <div>
                <b>Recalculation from Event Chain</b>
                <pre className='bg-light p-3 border'>
                    { JSON.stringify(spooled.state, null, 4) }
                </pre>
            </div>
        </SplitPartitioned>
    )
}

export default FixedAddEventDetails;
