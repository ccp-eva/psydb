import React from 'react';
import ReactDOM from 'react-dom';

import { expect } from 'chai';
import { screen, render, fireEvent } from '@testing-library/react';

import { AgentContext } from '@mpieva/psydb-ui-contexts';
import useFetchAll from './use-fetch-all';

import jsdom from 'mocha-jsdom';
global.document = jsdom({
    url: "http://localhost:3000"
});

const agent = {
    resolve: () => Promise.resolve({ response: { data: 'DATA' }}),
    reject: () => Promise.reject({ response: 'ERROR' })
}

const Root = (ps) => {
    var { children } = ps;
    return (
        <AgentContext.Provider value={ agent }>
            <>{ children }</>
        </AgentContext.Provider>
    )
}

const Component = () => {
    var [ didFetch, fetched ] = useFetchAll((agent) => {
        return {
            A: agent.resolve(),
            B: agent.reject()
        }
    });

    if (!didFetch) {
        return null
    }

    console.log(fetched);

    return 'OK'
}


describe('useFetchAll()', () => {
    it('stuff', () => {
        const foo = render(
            <Root>
                <Component />
            </Root>
        )
    })
})
