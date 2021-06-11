import React from 'react';

import {
    Route,
    Switch,
    Redirect,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import ExperimentDetails from './details';

const Experiments = () => {
    var { path, url } = useRouteMatch();
    
    return (
        <div>
            <header>
                <h1 className='mb-0 border-bottom' role='button'>
                    Termin
                </h1>
            </header>
            <h5 className='mt-0 mb-3 text-muted' role='button'>
                Details
            </h5>
            <Switch>
                <Route path={ `${path}/:id` }>
                    <ExperimentDetails />
                </Route>
            </Switch>
        </div>
    );
}

export default Experiments
