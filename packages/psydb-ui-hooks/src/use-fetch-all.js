import React, { useEffect, useReducer, useContext } from 'react';
import { AgentContext } from '@mpieva/psydb-ui-contexts';
//import agent from '@mpieva/psydb-ui-request-agents';

const useFetchAll = (createPromises, dependenciesOrOptions = []) => {
    var options = dependenciesOrOptions;
    if (Array.isArray(dependenciesOrOptions)) {
        options = { dependencies: dependenciesOrOptions };
    }
    var { dependencies, extraEffect } = options;

    var contextAgent = useContext(AgentContext);
    var [ state, dispatch ] = useReducer(reducer, {
        didFetch: false,
        didReject: false,
    });

    var wrappedCreatePromises = () => {
        dispatch({ type: 'set-transmitting' });
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

        Promise.all(keys.map(k => keyedPromises[k]))
        .then((responses) => {
            extraEffect && extraEffect(keys.reduce(
                (acc, it, ix) => ({ ...acc, [it]: responses[ix] }),
                {}
            ));
            dispatch({ type: 'fetched-all' });
        })
        .catch((err) => {
            console.log(err.response);
            dispatch({ type: 'rejected', payload: {
                errorResponse: err.response,
            }});
        })
    };

    useEffect(wrappedCreatePromises, dependencies);

    return [ state.didFetch, state, state.isTransmitting ];
}

const reducer = (state, action) => {
    var { type, payload } = action;
    switch (type) {
        case 'set-transmitting':
            return ({
                ...state,
                isTransmitting: true,
            })
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
                didFetch: true,
                isTransmitting: false,
            })
        case 'rejected':
            return ({
                ...state,
                didFetch: true,
                didReject: true,
                isTransmitting: false,
                errorResponse: payload.errorResponse,
            })

    }
}

export default useFetchAll;
