import React, { useEffect, useState } from 'react';

import {
    HashRouter as Router,
} from 'react-router-dom';

import { simple as agent } from '@mpieva/psydb-ui-request-agents';
import { SelfContext } from '@mpieva/psydb-ui-contexts';
import ErrorBoundary from './error-boundary';
import SignIn from './sign-in';
import Main from './main'

const App = () => {

    var [ isSignedIn, setIsSignedIn ] = useState(false);
    var [ self, setSelf ] = useState();
    var [ isInitialized, setIsInitialized ] = useState(false);

    var onSignedIn = (self) => {
        setIsSignedIn(true);
        setSelf(self);
    }

    var onSignedOut = () => {
        setIsSignedIn(false);
    }

    useEffect(() => {
        agent.get('/api/self').then(
            (res) => {
                var self = res.data.data;
                onSignedIn(self);
                setIsInitialized(true)
            },
            (error) => {
                setIsInitialized(true)
            }
        )
    }, [ /* noDidUpdate */ ]);

    var View = undefined;
    if (isInitialized) {
        View = (
            isSignedIn && self
            ? (
                <SelfContext.Provider value={ self }>
                    <Main onSignedOut={ onSignedOut } />
                </SelfContext.Provider>
            )
            : <SignIn onSignedIn={ onSignedIn } />
        );
    }
    else {
        View = <AppInitializing />
    }

    return (
        <ErrorBoundary>
            <Router>
                { View }
            </Router>
        </ErrorBoundary>
    );
}

const AppInitializing = () => (
    <div>Loading</div>
)

export default App;
