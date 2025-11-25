import React from 'react';
import { useHistory } from 'react-router';
import { Route, Switch } from 'react-router-dom';

import { useRequestAgent } from '@mpieva/psydb-ui-contexts';
import FullScreenRoutes from './main-full-screen-routes';
import LayoutedRoutes from './main-layouted-routes';

const Main = (ps) => {
    var { onSignedIn, onSignedOut } = ps;
    
    var history = useHistory();
    var agent = useRequestAgent();

    var onSignOut = () => (
        agent.signOut()
        .then(
            (res) => {
                //console.log('logged out');
                onSignedOut();
                history.push('/');
            },
            (error) => {
                //console.log('error on logout');
            }
        )
    );

    return (
        <Switch>
            <Route path='/full-screen'>
                <FullScreenRoutes />
            </Route>

            <Route>
                <LayoutedRoutes { ...({ onSignOut }) }/>
            </Route>
        </Switch>
    )
}


export default Main;
