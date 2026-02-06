import { useMemo, useCallback } from 'react';
import omit from '@cdxoo/omit';
import { JsonBase64 } from '@cdxoo/json-base64';
import { useURLSearchParams } from '@cdxoo/react-router-url-search-params';

import { transliterate } from '@mpieva/psydb-core-utils';

const useURLSearchParamsB64 = (options = {}) => {
    var {
        defaults,
        containerKey = 'q',
        ...pass
    } = options;

    var [ queryB64, updateQueryB64 ] = useURLSearchParams(pass);
    
    var paramsPOJO = useMemo(() => {
        var raw = queryB64[containerKey];
        var decoded = JsonBase64.decode(raw);
        return { ...defaults, ...decoded };
    }, [ queryB64, containerKey, /*defaults*/ ]);
    // FIXME: we cant use defaults as dependency as it is an object
    // and this will always be !== ... we would need to deep check this

    var updateParams = useCallback((obj, options) => {
        var stringified = JsonBase64.encode(obj);
        var out = (
            !stringified
            ? omit(containerKey, queryB64)
            : { ...queryB64, [containerKey]: stringified }
        );
        return updateQueryB64(out, options);
    }, [ updateQueryB64 ]);

    return [
        paramsPOJO,
        updateParams
    ];
}

export default useURLSearchParamsB64;
