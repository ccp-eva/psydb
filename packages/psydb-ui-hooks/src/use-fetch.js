import { useEffect, useReducer, useContext } from 'react';
import { AgentContext } from '@mpieva/psydb-ui-contexts';
//import agent from '@mpieva/psydb-ui-request-agents';

const useFetch = (...args) => {
    if (args.length < 3) {
        args = [ args[0], defaultInit, args[1] ];
    }
    var [
        createPromise,
        init,
        dependencies
    ] = args;

    var contextAgent = useContext(AgentContext);

    var reducer = createReducer(init);
    var [ state, dispatch ] = useReducer(reducer, { didFetch: false });

    var wrappedCreatePromise = () => {
        var promise = createPromise(contextAgent);
        if (promise) {
            promise.then((response) => {
                dispatch({ type: 'init-data', payload: {
                    response: response,
                    data: response.data.data
                }})
            })
        }
        else {
            dispatch({ type: 'fake-fetch' })
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
        case 'fake-fetch':
            return ({
                ...state,
                didFetch: true
            })
    }
}

export default useFetch;
