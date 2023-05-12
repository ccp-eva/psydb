import React, { useEffect, useReducer, useContext, useState } from 'react';
import { AgentContext } from '@mpieva/psydb-ui-contexts';

/*

var [ didFetch, fetched ] = useFetchChain(({ agent, holder }) => ([
    ({ agent, context, args }) => ({
        fooList: agent.post('/foo', { id: 43 })
    }),
    ...
]), [ someDependencyProp ]);

var { fooList } = fetched;

// or //////////////////////

var fetchable = useFetchChain(({ agent, holder }) => ([
    ({ agent, context, args }) => ({
        fooList: agent.post('/foo', { id: args[0] })
    }),
    ...
]), { useEffect: false });

fetchable.exec(43).then(({ context }) => {
    var { fooList } = context;
})

*/

const useFetchChain = (createStages, dependencyPropsOrOptions) => {
    var options = undefined;
    var dependencyProps = undefined;
    if (Array.isArray(dependencyPropsOrOptions)) {
        dependencyProps = dependencyPropsOrOptions;
    }
    else {
        options = dependencyPropsOrOptions;
        dependencyProps = (options || {}).dependencies;
    }
    options = {
        useEffect: true,
        extraParams: undefined,
        ...options
    }

    var agent = useContext(AgentContext);
    var chained = createFetchChain({
        createStages,
        agent,
        extraParams: options.extraParams,
    });

    if (options.useEffect) {
        var [ state, setState ] = useState({ didFetch: false });
        var exec = (...args) => {
            chained(...args).then((context) => {
                setState(context)
            });
        };

        useEffect(exec, dependencyProps);
        return [ state.didFetch, state ];
    }
    else {
        var exec = (...args) => {
            return chained(...args);
        };

        return { exec };
    }
}

const createFetchChain = (options) => (...args) => {
    var { createStages, agent, extraParams } = options;

    var internalState = undefined;
    var internalDispatch = (action) => {
        internalState = reducer(internalState, action);
    }

    var wrapStage = (createKeyedPromises) => ({ context, args }) => {
        var keyedPromises = createKeyedPromises({
            agent,
            context,
            args,
            extraParams,
        });

        var keys = Object.keys(keyedPromises);
        keys.forEach(k => {
            var promise = keyedPromises[k];
            if (!promise || typeof promise.then !== 'function') {
                throw new Error(
                    `value of key "${k}" is "${promise}" not a promise`
                );
            }
            promise.then((response) => {
                internalDispatch({ type: 'init-data', payload: {
                    key: k,
                    response: response,
                    data: response.data.data
                }});
                //console.log({ k, internalState })
            })
        });

        return Promise.all(keys.map(k => keyedPromises[k]));
    }

    var wrappedStages = createStages({ agent }).map(wrapStage);
    
    var chained = wrappedStages.reduce((fnA_promise, fnB) => (
        fnA_promise.then(() => {
            //console.log('fnB');
            var out = fnB({ context: internalState, args });
            return out;
        })
    ), Promise.resolve());

    return (
        chained
        .then(() => {
            //console.log('done-all')
            internalDispatch({ type: 'fetched-all' });
            return internalState;
        })
    );

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
                },
                _stageDatas: {
                    ...state?._stageDatas,
                    [payload.key]: payload.data
                },
                _stageResponses: {
                    ...state?._stageResponses,
                    [payload.key]: payload.response
                },
            });
        case 'fetched-all':
            return ({
                ...state,
                didFetch: true
            })

    }
}

export default useFetchChain;
