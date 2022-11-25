import { useState } from 'react';

const useSortReducer = (initial = {}) => {
    var [ state, setState ] = useState(initial);
    var { sortPath, sortDirection } = state;

    var setSort = (bag) => {
        var { sortPath, sortDirection } = bag;
        setState({
            sortPath,
            sortDirection,
        });
    }

    return {
        sortPath,
        sortDirection,

        setSort,
    };
}

export default useSortReducer;
