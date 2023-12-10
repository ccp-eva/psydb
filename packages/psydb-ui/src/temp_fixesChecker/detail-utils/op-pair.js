import React, { useState } from 'react';
import { ucfirst } from '@mpieva/psydb-core-utils';
import { TabNav } from '@mpieva/psydb-ui-layout';

import { OpsList } from '../shared-utils';

import { JsonRaw } from './json-raw';
import { SpooledRecord } from './spooled-record';
import { RohrpostEventRecord } from './rohrpost-event-record';

export const OpPair = (ps) => {
    var { pair, related } = ps;
    var [ activeKey, setActiveKey ] = useState('raw-ops');
   
    var content = null;
    if (activeKey === 'raw-ops') {
        content = (
            <>
                <OpsList
                    title='Operations'
                    ops={ Object.values(pair) } related={ related }
                />
                <hr />
                <JsonRaw
                    title='Raw Ops'
                    data={ pair }
                />
            </>
        )
    }
    else if (activeKey === 'rohrpostEvents') {
        content = (
            <RohrpostEventRecord
                id={ pair[activeKey].args[0]._id }
            />
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
                    { key: 'raw-ops', label: 'Ops Data' },
                    ...Object.keys(pair).map((key, ix) => ({
                        key, label: ucfirst(key)
                    }))
                ]}
            />
            { content }
        </>
    )
}
