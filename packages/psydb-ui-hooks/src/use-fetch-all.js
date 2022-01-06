import React, { useEffect, useReducer, useContext } from 'react';
import { AgentContext } from '@mpieva/psydb-ui-contexts';
//import agent from '@mpieva/psydb-ui-request-agents';

const useFetchAll = (createPromises, triggerProps) => {
    var contextAgent = useContext(AgentContext);
    var [ state, dispatch ] = useReducer(reducer, { didFetch: false });

    var wrappedCreatePromises = () => {
        var keyedPromises = createPromises(contextAgent);
        var keys = Object.keys(keyedPromises);

        // NOTE: using let prevents issue with k being always the last key
        // we could wrap it in foreach wich would also work
        //for (let k of keys) {
        keys.forEach(k => {
            var promise = keyedPromises[k];
            promise.then((response) => {
                dispatch({ type: 'init-data', payload: {
                    key: k,
                    response: response,
                    data: response.data.data
                }})
            })
        });

        Promise.all(keys.map(k => keyedPromises[k])).then(() => {
            dispatch({ type: 'fetched-all' });
        })
    };

    useEffect(wrappedCreatePromises, triggerProps);

    return [ state.didFetch, state ];
}

const reducer = (state, action) => {
    var { type, payload } = action;
    switch (type) {
        case 'init-data':
            return ({
                ...state,
                [payload.key]: {
                    data: payload.data,
                    response: payload.response,
                }
            });
        case 'fetched-all':
            return ({
                ...state,
                didFetch: true
            })

    }
}

export default useFetchAll;
