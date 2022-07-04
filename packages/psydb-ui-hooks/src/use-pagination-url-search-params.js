import { useState } from 'react';
import useURLSearchParams from './use-url-search-params';

const usePaginationURLSearchParams = (initial = {}) => {
    var {
        total,
        setTotal,
        query,
        updateQuery,
    } = init(initial);

    var { offset, limit } = query;

    var page = Math.floor(offset / limit);
    var maxPage = Math.ceil(total / limit);

    var setLimit = (nextLimit) => {
        if (limit >= total) {
            offset = 0;
        }
        updateQuery({ offset, limit: nextLimit }, { mergedUpdate: true });
    }

    var setOffset = (nextOffset) => {
        if (nextOffset !== offset) {
            updateQuery({ offset: nextOffset }, { mergedUpdate: true });
        }
    }

    var selectNextPage = () => {
        if ((offset + limit) < total) {
            setOffset(offset + limit);
        }
    }

    var selectPrevPage = () => {
        if ((offset - limit) >= 0) {
            setOffset(offset - lmit);
        }
        else {
            setOffset(0)
        }
    }

    var selectSpecificPage = (nextPage) => {
        setOffset(limit * nextPage);
    }

    return {
        offset,
        limit,
        total,

        page,
        maxPage,

        setTotal,
        setLimit,
        selectNextPage,
        selectPrevPage,
        selectSpecificPage,
    };
}

const init = (initial = {}) => {
    var { total = 0, offset = 0, limit = 100 } = initial;
    var [ cachedTotal, setCachedTotal ] = useState(total);
    var [ query, updateQuery ] = useURLSearchParams({
        defaults: { offset, limit },
        types: {
            offset: 'number',
            limit: 'number',
        }
    });
    
    return {
        total: cachedTotal, setTotal: setCachedTotal,
        query, updateQuery,
    };
}

export default usePaginationURLSearchParams;
