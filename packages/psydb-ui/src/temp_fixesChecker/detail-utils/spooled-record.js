import React, { useState } from 'react';
import ReactDiffViewer from 'react-diff-viewer';
import { useFetch } from '@mpieva/psydb-ui-hooks';
import {
    LoadingIndicator,
    SplitPartitioned,
    Button
} from '@mpieva/psydb-ui-layout';

import { JsonDiff } from './json-diff';
import { JsonRaw } from './json-raw';

export const SpooledRecord = (ps) => {
    var { collection, id } = ps;
    var [ showEventChain, setShowEventChain ] = useState(false);

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.fetchSpooledRecord({ collection, id })
    ), [ id ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { record, spooled, eventChain } = fetched.data;

    var partitions = [1];
    partitions.push(
        showEventChain ? 1 : 0
    );

    return (
        <div className='position-relative'>
            <div className='position-absolute' style={{ top: 0, right: 0 }}>
                <Button
                    onClick={() => setShowEventChain(!showEventChain)}
                >Show Event Chain</Button>
            </div>
            <SplitPartitioned partitions={ partitions }>
                <JsonDiff
                    oldValue={ record }
                    newValue={ spooled }
                    orderKeys
                    splitView
                />
                { showEventChain && (
                    <JsonRaw title='Event Chain' data={ eventChain } />
                )}
            </SplitPartitioned>
        </div>
    )
}
/*
                <JsonRaw
                    title='Cached Record'
                    data={ record } orderKeys
                />
                <JsonRaw
                    title='Recalculation from Event Chain'
                    data={ spooled } orderKeys
                />
*/
