import React from 'react';
import ReactDiffViewer from 'react-diff-viewer';
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

export const JsonDiff = (ps) => {
    var { title, oldValue, newValue, orderKeys = false, ...pass } = ps;
    
    if (orderKeys) {
        oldValue = orderKeysDeep(oldValue);
        newValue = orderKeysDeep(newValue);
    }

    return (
        <ReactDiffViewer
            oldValue={ JSON.stringify(oldValue, null, 4) }
            newValue={ JSON.stringify(newValue, null, 4) }
            { ...pass }
        />
    )
}
