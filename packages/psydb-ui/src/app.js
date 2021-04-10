import React, { useEffect, useState } from 'react';

import agent from './public-agent';
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
                console.log('fetched stuff')
                console.log(res);
                onSignedIn()
                setIsInitialized(true)
            },
            (error) => {
                console.log('failed axios')
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
            { View }
        </ErrorBoundary>
    );
}

const AppInitializing = () => (
    <div>Loading</div>
)

export default App;
