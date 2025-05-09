import { useEffect, useReducer, useContext } from 'react';
import { AgentContext } from '@mpieva/psydb-ui-contexts';

const useFetch = (...args) => {
    if (args.length < 3) {
        if (Array.isArray(args[1])) {
            args = [ args[0], { dependencies: args[1] }];
        }
        else {
            args = [ args[0], args[1] ];
        }
    }
    if (args.length === 3) {
        args = [ args[0], { init: args[1], dependencies: args[2] }];
    }
    var [
        createPromise,
        options
    ] = args;

    options = {
        useEffect: true,
        ...options
    };

    var {
        init = defaultInit,
        dependencies,
        extraEffect,
        resetDidFetchOnDependencyChange = false,
    } = options;

    var contextAgent = useContext(AgentContext);

    var reducer = createReducer(init);
    var [ state, dispatch ] = useReducer(reducer, { didFetch: false });

    if (options.useEffect) {
        var wrappedCreatePromise = () => {
            dispatch({ type: 'set-transmitting' });
            if (resetDidFetchOnDependencyChange) {
                dispatch({ type: 'start-fetch' });
            }
            
            var promise = createPromise(contextAgent);
            if (promise) {
                promise
                .then((response) => {
                    extraEffect && extraEffect(response);
                    dispatch({ type: 'init-data', payload: {
                        response: response,
                        data: response.data.data
                    }})
                })
                .catch((err) => {
                    console.log(err.response);
                    dispatch({ type: 'rejected', payload: {
                        errorResponse: err.response,
                    }});
                    if (!err.response) {
                        throw err;
                    }
                })
            }
            else {
                dispatch({ type: 'fake-fetch' })
            }
        };

        useEffect(wrappedCreatePromise, dependencies);
        return [ state.didFetch, state, state.isTransmitting ];
    }
    else {
        var exec = () => {
            dispatch({ type: 'set-transmitting' });
            if (resetDidFetchOnDependencyChange) {
                dispatch({ type: 'start-fetch' });
            }
            
            return createPromise(contextAgent).then((response) => {
                //console.log(response);
                dispatch({ type: 'init-data', payload: {
                    response: response,
                    data: response.data.data
                }})
                // NOTE: csv export requires response.data
                return response;
            })
        };
        return { exec, isTransmitting: state.isTransmitting };
    }
}

const defaultInit = (payload) => ({
    data: payload.data,
    response: payload.response,
});

const createReducer = (init) => (state, action) => {
    var { type, payload } = action;
    switch (type) {
        case 'set-transmitting':
            return ({
                ...state,
                isTransmitting: true,
            })
        case 'start-fetch':
            return ({
                ...state,
                didFetch: false
            })
        case 'init-data':
            return ({
                ...state,
                didFetch: true,
                isTransmitting: false,
                ...init(payload),
            })
        case 'fake-fetch':
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

export default useFetch;
