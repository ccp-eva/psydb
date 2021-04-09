import React, { useEffect, useState } from 'react';
import axios from 'axios';

import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom';


import SignIn from './sign-in';

export const App = () => {

    var [ isSignedIn, setIsSignedIn ] = useState(false);

    useEffect(() => {
        axios.get('//google.com').then(
            (res) => {
                console.log('fetched stuff')
            },
            (error) => {
                console.log('failed axios')
            }
        )
    });

    return (
        isSignedIn
        ? <Main />
        : <SignIn />
    );
}

const Main = () => (
    <Router>
        <div>
            <Link to='/'>Slash</Link>
            <Link to='/nested'>Nested</Link>
            <Route path='/nested' component={Nested} />
        </div>
    </Router>
)

const Nested = () => (
    <div>Nested</div>
)
