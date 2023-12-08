import React, { useState } from 'react';
import { TabNav } from '@mpieva/psydb-ui-layout';

import { OpsList } from '../shared-utils';

import { chunkOps } from './chunk-ops';
import { JsonRaw } from './json-raw';
import { OpChunk } from './op-chunk';

export const Chunks = (ps) => {
    var { update, related } = ps;
    var { ops } = update;
    var chunked = chunkOps({ ops });

    var [ activeKey, setActiveKey ] = useState('raw-update');
    
    return (
        <>
            <TabNav
                activeKey={ activeKey }
                onItemClick={ setActiveKey }
                items={[
                    { key: 'raw-update', label: 'Update Data' },
                    ...chunked.map((it, ix) => ({
                        key: String(ix), label: `Op-Chunk ${ix}`
                    }))
                ]}
            />
            { activeKey === 'raw-update' ? (
                <div className='mt-3'>
                    <OpsList
                        title='Operations'
                        ops={ ops } related={ related }
                    />
                    <hr />
                    <JsonRaw
                        title='Raw Update'
                        data={ update }
                    />
                </div>
            ) : (
                <OpChunk
                    chunk={ chunked[parseInt(activeKey)] }
                    related={ related }
                />
            )}
            
        </>
    )
}
