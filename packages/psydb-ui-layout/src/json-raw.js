import React from 'react';
import { flatten, unflatten } from '@mpieva/psydb-core-utils';

const orderKeysDeep = (that) => {
    var flat = flatten(that);
    var orderedflat = {};
    for (var key of Object.keys(flat).sort()) {
        orderedflat[key] = flat[key];
    }

    var out = unflatten(orderedflat);
    return out;
}

export const JsonRaw = (ps) => {
    var { title, data, orderKeys = false, ...pass } = ps;
    
    return (
        <div { ...pass }>
            <b>{ title }</b>
            <PRE
                data={ data } orderKeys={ orderKeys }
                className='bg-light p-3 border'
            />
        </div>
    )
}

const PRE = (ps) => {
    var { data, orderKeys = false, ...pass } = ps;

    if (orderKeys) {
        data = orderKeysDeep(data);
    }

    return (
        <pre { ...pass }>
            { JSON.stringify(data, null, 4) }
        </pre>
    )
}
JsonRaw.PRE = PRE;

