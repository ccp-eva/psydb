import { useEffect, useReducer } from 'react';
import agent from '@mpieva/psydb-ui-request-agents';

const useFetch = (...args) => {
    if (args.length < 3) {
        args = [ args[0], defaultInit, args[1] ];
    }
    var [
        createPromise,
        init,
        dependencies
    ] = args;

    var reducer = createReducer(init);
    var [ state, dispatch ] = useReducer(reducer, { didFetch: false });

    var wrappedCreatePromise = () => {
        var promise = createPromise(agent);
        if (promise) {
            promise.then((response) => {
                dispatch({ type: 'init-data', payload: {
                    response: response,
                    data: response.data.data
                }})
            })
        }
    };

    useEffect(wrappedCreatePromise, dependencies);

    return [ state.didFetch, state ];
}

const defaultInit = (payload) => ({
    data: payload.data,
    response: payload.response,
});

const createReducer = (init) => (state, action) => {
    var { type, payload } = action;
    switch (type) {
        case 'init-data':
            return ({
                ...state,
                didFetch: true,
                ...init(payload),
            })
    }
}

export default useFetch;
