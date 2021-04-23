import React, { useState, useEffect, useReducer } from 'react';

import {
    Route,
    Switch,
    Redirect,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import agent from '@mpieva/psydb-ui-request-agents';

const SearchContainer = () => {
    var { path, url } = useRouteMatch();
    return (
        <div>FOOOO</div>
    )
}

export default SearchContainer;
