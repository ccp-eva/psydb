import React, { useState, useEffect } from 'react';

import {
    Route,
    Switch,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

const LabOperation = () => {
    var { path, url } = useRouteMatch();
    return (
        <div>
            <header>
                <h1 style={{ borderBottom: '1px solid lightgrey' }}>
                    Laborbetrieb
                </h1>
            </header>
            <Switch>
                <Route exact path={`${path}`}>
                    <div>TODO: show big nav</div>
                </Route>
                <Route path={`${path}/reservation`}>
                    <div>
                        <div>select study</div>
                        <div>show tabs teams/rooms</div>
                        <div>if rooms select room</div>
                        <div>show reservation calendar(s)</div>
                    </div>
                </Route>
                <Route path={`${path}/subject-selection`}>
                    <div>
                        <div>have tabs for inhouse/away</div>
                        <div>select studies (multiple)</div>
                        <div>select subject type</div>
                        <div>select age-windows</div>
                    </div>
                </Route>
            </Switch>
        </div>

    )
}

export default LabOperation;
