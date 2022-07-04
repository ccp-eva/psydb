import { useMemo, useCallback } from 'react';
import {
    useURLSearchParams as useURLSearchParams_RAW
} from '@cdxoo/react-router-url-search-params';

import { entries, transliterate } from '@mpieva/psydb-core-utils';

const useURLSearchParams = (bag = {}) => {
    var {
        types = {},
        ...pass
    } = bag;

    var [ queryRaw, updateQueryRaw ] = useURLSearchParams_RAW(pass);

    var query = useMemo(() => (
        parseQueryValues(queryRaw, types)
    ), [ queryRaw ]);

    var updateQuery = useCallback((obj, options = {}) => {
        var tmp = stringifyObjectValues(obj, types);
        return updateQueryRaw(tmp);
    }, [ updateQueryRaw ])

    return [ query, updateQuery ];
}

var stringifyObjectValues = (obj, types = {}) => {
    var out = {};
    for (var [ key, value ] of entries(obj)) {
        
        if (value === undefined || value === null || Number.isNaN(value)) {
            continue;
        }

        var type = types[key];
        switch (type) {
            case 'jsonB64':
                out[key] = encodeJsonB64(value);
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

var parseQueryValues = (queryRaw, types = {}) => {
    var out = {};
    for (var [ key, value ] of entries(queryRaw)) {
        var type = types[key];
        switch (type) {
            case 'jsonB64':
                out[key] = decodeJsonB64(value);
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


var encodeJsonB64 = (obj, options = {}) => {
    var { urlSafe = true, shouldThrow = false } = options;
    var encoded = '';
    try {
        encoded = Base64.encode(JSON.stringify(obj));
        if (urlSafe) {
            encoded = transliterate(encoded, '+/=', '._-');
        }
    }
    catch (e) {
        if (shouldThrow) {
            throw e;
        }
    }

    return encoded;
}

var decodeJsonB64 = (str, options = {}) => {
    var { urlSafe = true, shouldThrow = false } = options;
    
    var decoded = {};
    try {
        if (urlSafe) {
            str = transliterate(str, '._-', '+/=')
        }
        decoded = JSON.parse(Base64.decode(str));
    }
    catch (e) {
        if (shouldThrow) {
            throw e;
        }
    }

    return decoded;
}

export default useURLSearchParams;
