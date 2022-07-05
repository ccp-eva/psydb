import { useMemo, useCallback } from 'react';
import { JsonBase64 } from '@cdxoo/json-base64';
import {
    useURLSearchParams as useURLSearchParams_RAW
} from '@cdxoo/react-router-url-search-params';

import { entries } from '@mpieva/psydb-core-utils';

const useURLSearchParams = (bag = {}) => {
    var {
        types = {},
        ...pass
    } = bag;

    var prepareUpdate = createPrepareUpdate(types);
    var parseReceived = createParseReceived(types);

    var [ query, updateQuery ] = useURLSearchParams_RAW({
        prepareUpdate,
        parseReceived,
        ...pass
    });
    
    return [ query, updateQuery ];
}

var createPrepareUpdate = (types = {}) => (obj) => {
    var out = {};
    for (var [ key, value ] of entries(obj)) {
        
        if (value === undefined || value === null || Number.isNaN(value)) {
            continue;
        }

        var type = types[key];
        switch (type) {
            case 'jsonB64':
                out[key] = JsonBase64.encode(value);
                break;

            case 'bool':
            case 'number':
            case 'string':
            default:
                out[key] = String(value);
                break;
        }
    }

    return out;
}

var createParseReceived = (types = {}) => (queryRaw) => {
    var out = {};
    for (var [ key, value ] of entries(queryRaw)) {
        var type = types[key];
        switch (type) {
            case 'jsonB64':
                out[key] = JsonBase64.decode(value);
                break;

            case 'bool':
                out[key] = value === 'true' ? true : false;
                break;
            case 'number':
                out[key] = Number.parseFloat(value);
                break;
            case 'string':
            default:
                out[key] = value;
                break;
        }
    }
    return out;
}

export default useURLSearchParams;
