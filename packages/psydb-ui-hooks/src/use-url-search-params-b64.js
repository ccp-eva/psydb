import { useMemo, useCallback } from 'react';
import { useLocation, useHistory } from 'react-router';
import { Base64 } from 'js-base64';
import omit from '@cdxoo/omit';
import { useURLSearchParams } from '@cdxoo/react-router-url-search-params';

import { transliterate } from '@mpieva/psydb-core-utils';

const useURLSearchParamsB64 = (options = {}) => {
    var {
        defaults,
        containerKey = 'q',
        ...pass
    } = options;

    var [ queryB64, updateQueryB64 ] = useURLSearchParams(pass);
    
    let paramsPOJO = useMemo(() => {
        var raw = queryB64[containerKey];
        var decoded = {};
        try {
            decoded = JSON.parse(Base64.decode(
                transliterate(raw, '._-', '+/=')
            ))
        }
        catch (e) {
            // intentionally ignored
        }

        let paramsPOJO = { ...defaults };
        for (let key of Object.keys(decoded)) {
            paramsPOJO[key] = decoded[key];
        }
        return paramsPOJO;
    }, [ queryB64, containerKey, /*defaults*/ ]);
    // FIXME: we cant use defaults as dependency as it is an object
    // and this will always be !== ... we would need to deep check this

    let updateParams = useCallback((obj, options) => {
        let stringified = '';
        try {
            stringified = transliterate(
                Base64.encode(JSON.stringify(obj)),
                '+/=', '._-'
            );
        }
        catch (e) {
            // intentionally ignored
        }

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
