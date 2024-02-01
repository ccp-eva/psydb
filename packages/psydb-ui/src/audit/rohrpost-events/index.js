import React from 'react';
import { useRouteMatch, Route, Switch } from 'react-router-dom';

import List from './list';
import Details from './details';

const RohrpostEventsRouting = (ps) => {
    var { path } = useRouteMatch();

    return (
        <Switch>
            <Route exact path={ `${path}`}>
                <List />
            </Route>
            <Route exact path={ `${path}/:id`}>
                <Details />
            </Route>
        </Switch>
    )
}

export default RohrpostEventsRouting;
