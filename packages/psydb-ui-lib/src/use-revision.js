import { useReducer, useCallback } from 'react';

const useRevision = () => {
    var [ state, dispatch ] = useReducer(reducer, { revision: 0 });

    var increment = useCallback(() => {
        dispatch({ type: 'increment-revision' })
    }, [])

    return [ state.revision, increment ];
}

const reducer = (state, action) => {
    var { type, payload } = action;
    switch (type) {
        case 'increment-revision':
            return ({
                ...state,
                revision: (state.revision || 0) + 1,
            })
    }
}

export default useRevision;
