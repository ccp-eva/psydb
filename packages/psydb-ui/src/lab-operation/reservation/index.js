import React, { useState, useEffect } from 'react';

import {
    Route,
    Switch,
    Redirect,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import agent from '@mpieva/psydb-ui-request-agents';

const Reservation = () => {
    var { path, url } = useRouteMatch();
    var { studyType } = useParams();
    return (
        <>
            <div>select study</div>
            <div>show tabs teams/rooms</div>
            <div>if rooms select room</div>
            <div>show reservation calendar(s)</div>
        </>
    );
}

const StudyPicker = () => {
    var [ study, setStudy ] = useState();
    return (
        <div></div>
    )
}

export default Reservation;
