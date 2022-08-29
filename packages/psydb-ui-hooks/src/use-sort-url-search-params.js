import useURLSearchParams from './use-url-search-params';

const useSortURLSearchParams = (initial = {}) => {
    var {
        query,
        updateQuery,
    } = init(initial);

    var { sortPath, sortDirection } = query;

    var setSort = (bag) => {
        var { sortPath, sortDirection } = bag;
        updateQuery({
            sortPath,
            sortDirection,
        }, { mergedUpdate: true });
    }

    return {
        sortPath,
        sortDirection,

        setSort,
    };
}

const init = (initial = {}) => {
    var { sortPath, sortDirection } = initial;
    var [ query, updateQuery ] = useURLSearchParams({
        defaults: { sortPath, sortDirection },
        types: {
            offset: 'string',
            limit: 'string',
        }
    });
    
    return {
        query, updateQuery,
    };
}

export default useSortURLSearchParams;
