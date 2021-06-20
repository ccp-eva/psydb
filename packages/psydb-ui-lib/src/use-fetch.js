import React, { useEffect, useReducer } from 'react';
import agent from '@mpieva/psydb-ui-request-agents';

const useFetch = (createPromise, triggerProps) => {
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

    useEffect(wrappedCreatePromise, triggerProps);

    return [ state.didFetch, state ];
}

const reducer = (state, action) => {
    var { type, payload } = action;
    switch (type) {
        case 'init-data':
            return ({
                ...state,
                didFetch: true,
                data: payload.data,
                response: payload.response,
            })
    }
}

export default useFetch;
