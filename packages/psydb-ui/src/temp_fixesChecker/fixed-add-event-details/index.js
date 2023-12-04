import React, { useState } from 'react';
import { useParams } from 'react-router';
import { useFetch } from '@mpieva/psydb-ui-hooks';

import {
    LoadingIndicator,
    PageWrappers,
    SplitPartitioned,
    TabNav,
    Button,
} from '@mpieva/psydb-ui-layout';

var findId = ({ ops, collection }) => (
    ops.find(it => it.collection === collection)?.args[0]?._id
)

const FixedAddEventDetails = () => {
    var { id } = useParams();

    var [ showEventChain, setShowEventChain ] = useState(false);
    var [ activeKey, setActiveKey ] = useState('experiment')

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
            <PageWrappers.Level2 title='Details'>
                <div className='mb-3 pb-3 border-bottom d-flex justify-content-between align-items-end'>
                    <div>
                        <b>UpdateID:</b> { id }<br />

                        <a 
                            className='d-block' target='_blank'
                            href={`/#/experiments/${experimentId}`}
                        >
                            Go to Experiment Details
                        </a>
                        { subjectId && (
                            <a 
                                className='d-block' target='_blank'
                                href={`/#/subjects/${subjectId}`}
                            >
                                Go to Subject Record Details
                            </a>
                        )}
                    </div>
                    <Button
                        onClick={() => setShowEventChain(!showEventChain)}
                    >Show Event Chain</Button>
                </div>
                <TabNav
                    className='mb-3'
                    activeKey={ activeKey }
                    items={[
                        { key: 'experiment', label: 'Experiment' },
                        ...(subjectId ? [
                            { key: 'subject', label: 'Subject' }
                        ] : [])
                    ]}
                    onItemClick={ setActiveKey }
                />
                { experimentId && (
                    <SpooledExperiment
                        id={ experimentId }
                        showEventChain={ showEventChain }
                    />
                )}
            </PageWrappers.Level2>
        </PageWrappers.Level1>
    )
}

const SpooledExperiment = (ps) => {
    var { id, showEventChain } = ps;

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.fetchSpooledRecord({ collection: 'experiment', id })
    ), [ id ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { record, spooled, eventChain } = fetched.data;

    var partitions = [1,1];
    partitions.unshift(
        showEventChain ? 1 : 0
    );

    return (
        <SplitPartitioned partitions={ partitions }>
            { showEventChain && (
                <div>
                    <b>Event Chain</b>
                    <pre className='bg-light p-3 border'>
                        { JSON.stringify(eventChain, null, 4) }
                    </pre>
                </div>
            )}
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
