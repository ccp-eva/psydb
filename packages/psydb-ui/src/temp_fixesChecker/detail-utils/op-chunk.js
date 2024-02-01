import React, { useState } from 'react';
import { ucfirst } from '@mpieva/psydb-core-utils';
import { TabNav } from '@mpieva/psydb-ui-layout';

import { OpPair } from './op-pair';

export const OpChunk = (ps) => {
    var { chunk, related } = ps;
    
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
                related={ related }
            />
        </>
    )
}
