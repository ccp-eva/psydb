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
import RecordPicker from './record-picker';

const ReservationRouting = () => {
    var { path, url } = useRouteMatch();
    return (
        <>
            <h2>Reservierung</h2>
            <Switch>
                <Route exact path={`${path}`}>
                    <ReservationIndex />
                </Route>
                <Route path={`${path}/:studyId`}>
                    <Reservation />
                </Route>
            </Switch>
        </>
    )
}

const ReservationIndex = () => {
    var { path, url } = useRouteMatch();
    var { studyType } = useParams();
    var history =  useHistory();
    return (
        <RecordPicker
            collection='study'
            recordType={ studyType }
            onChange={ (nextStudyRecord) => {
                    history.push(`${url}/${nextStudyRecord._id}`)
            }}
        />
    )
}

const Reservation = () => {
    var { path, url } = useRouteMatch();
    var { studyType, studyId } = useParams();
    var history =  useHistory();

    var [ studyRecord, setStudyRecord ] = useState();
    var [ isInitialized, setIsInitialized ] = (
        useState(studyId ? false : true)
    );

    useEffect(() => {
        agent.readRecord({
            collection: 'study',
            recordType: studyType,
            id: studyId,
            additionalParams: {
                labelOnly: true
            }
        })
        .then((response) => {
            setStudyRecord(response.data.data.record);
            setIsInitialized(true)
        });
    }, [ studyType, studyId ]);

    if (!isInitialized) {
        return (
            <div>Loading...</div>
        );
    }

    return (
        <>

            <RecordPicker
                collection='study'
                recordType={ studyType }
                value={ studyRecord }
                onChange={ (nextStudyRecord) => {
                    history.push(`${nextStudyRecord._id}`)
                }}
            />

            <ReservationTypeNav />
            <Switch>
                <Route exact path={ path }>
                    <Redirect to={`${url}/locations`} />
                </Route>
                <Route path={ `${path}/locations`}>
                    <LocationReservation />
                </Route>
                <Route path={ `${path}/away-teams`}>
                    <AwayTeamReservation />
                </Route>
            </Switch>


            <div>select study</div>
            <div>show tabs teams/rooms</div>
            <div>if rooms select room</div>
            <div>show reservation calendar(s)</div>
        </>
    );
}

const LocationReservation = () => {
    var { path, url } = useRouteMatch();
    var { studyType, studyId } = useParams();
    var history =  useHistory();

    return (
        <div>fof</div>
    )
}

const AwayTeamReservation = () => {
    return (
        <div>at</div>
    )
}

import LinkButton from '@mpieva/psydb-ui-lib/src/link-button';
const ReservationTypeNav = () => {
    var { path, url } = useRouteMatch();
    var history =  useHistory();
    return (
        <div>
            <LinkButton to={`locations`}>
                Räumlichkeiten
            </LinkButton>
            <LinkButton to={`away-teams`}>
                Aussen-Teams
            </LinkButton>
        </div>
    )
}

export default ReservationRouting;
