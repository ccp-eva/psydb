import React, { useEffect, useState } from 'react';

import {
    HashRouter as Router,
} from 'react-router-dom';

import { simple as agent } from '@mpieva/psydb-ui-request-agents';
import ErrorBoundary from './error-boundary';
import SignIn from './sign-in';
import Main from './main'

const App = () => {

    var [ isSignedIn, setIsSignedIn ] = useState(false);
    var [ isInitialized, setIsInitialized ] = useState(false);

    var onSignedIn = () => {
        setIsSignedIn(true)
    }

    var onSignedOut = () => {
        setIsSignedIn(false);
    }

    useEffect(() => {
        agent.get('/api/self').then(
            (res) => {
                onSignedIn()
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
            isSignedIn
            ? <Main onSignedOut={ onSignedOut } />
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
