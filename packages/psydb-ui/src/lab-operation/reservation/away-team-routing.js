import React from 'react';

import {
    Route,
    Switch,
    Redirect,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import AwayTeams from './away-teams';

export const AwayTeamRouting = () => {
    return (
        <AwayTeams />
    )
}

