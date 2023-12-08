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

import { JsonRaw, SpooledRecord } from '../detail-utils';

var findId = ({ ops, collection }) => (
    ops.find(it => it.collection === collection)?.args[0]?._id
)

var makeChunks = ({ from, chunkSize }) => {
    var out = [];
    for (var i = 0; i < from.length; i += chunkSize) {
        var chunk = from.slice(i, i + chunkSize);
        out.push(chunk);
    }
    return out;
}

var splitOps = ({ ops }) => {
    var outChunks = [];
    for (var c of makeChunks({ from: ops, chunkSize: 4 })) {
        var pairs = makeChunks({ from: c, chunkSize: 2 });

        var outPairs = [];
        var targetCollection = undefined;
        for (var p of pairs) {
            var outItem = {};
            for (var it of p) {
                var { collection, args } = it;
                var { _id } = args[0];

                outItem[collection] = { targetId: _id, ...it };
                if (collection !== 'rohrpostEvents') {
                    targetCollection = collection;
                }
            }
            outPairs.push({ targetCollection, pair: outItem });
        }
        outChunks.push(outPairs);
    }
    return outChunks;
}

const FixedAddEventDetails = () => {
    var { id } = useParams();

    var [ activeKey, setActiveKey ] = useState('update')

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.fetchFixedAddEventDetails({ updateId: id })
    ), [ id ]);
    
    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { update } = fetched.data;
    var { ops } = update;

    var chunked = splitOps({ ops });
    console.log(chunked);




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
                </div>
                <Chunks update={ update } />
            </PageWrappers.Level2>
        </PageWrappers.Level1>
    )
}


const Chunks = (ps) => {
    var { update } = ps;
    var { ops } = update;
    var chunked = splitOps({ ops });

    var [ activeKey, setActiveKey ] = useState('raw-update');
    
    return (
        <>
            <TabNav
                activeKey={ activeKey }
                onItemClick={ setActiveKey }
                items={[
                    { key: 'raw-update', label: 'Raw Update' },
                    ...chunked.map((it, ix) => ({
                        key: String(ix), label: `Op-Chunk ${ix}`
                    }))
                ]}
            />
            { activeKey === 'raw-update' ? (
                <JsonRaw data={ update } />
            ) : (
                <OpChunk
                    chunk={ chunked[parseInt(activeKey)] }
                />
            )}
            
        </>
    )
}

import { ucfirst } from '@mpieva/psydb-core-utils';
const OpChunk = (ps) => {
    var { chunk } = ps;
    
    var [ activeKey, setActiveKey ] = useState('0');

    return (
        <>
            <TabNav
                activeKey={ activeKey }
                onItemClick={ setActiveKey }
                items={[
                    ...chunk.map((it, ix) => ({
                        key: String(ix), label: ucfirst(it.targetCollection)
                    }))
                ]}
            />
            <OpPair
                pair={ chunk[parseInt(activeKey)].pair }
            />
        </>
    )
}

const OpPair = (ps) => {
    var { pair } = ps;
    
    var [ activeKey, setActiveKey ] = useState('raw-ops');
    
    var content = null;
    if (activeKey === 'raw-ops') {
        content = (
            <JsonRaw data={ pair } />
        )
    }
    else if (activeKey === 'rohrpostEvents') {
        content = (
            <b>cant render yet</b>
        )
    }
    else if (pair[activeKey]) {
        content = (
            <SpooledRecord
                collection={ activeKey }
                id={ pair[activeKey].targetId }
                showEventChain={ true }
            />
        )
    }

    return (
        <>
            <TabNav
                className='mb-3'
                activeKey={ activeKey }
                onItemClick={ setActiveKey }
                items={[
                    { key: 'raw-ops', label: 'Raw Ops' },
                    ...Object.keys(pair).map((key, ix) => ({
                        key, label: ucfirst(key)
                    }))
                ]}
            />
            { content }
        </>
    )
}

export default FixedAddEventDetails;
