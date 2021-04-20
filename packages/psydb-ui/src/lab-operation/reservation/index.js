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
import RecordPicker from './record-picker';
import LocationCalendarList from './location-calendar-list';

var up = (url, levels = 0) => {
    for (var i = 0; i < levels; i += 1) {
        url = url.replace(/[\/]?[^/]+$/, '');
    }
    return url;
}

const ReservationRouting = ({ customRecordTypes }) => {
    var { path, url } = useRouteMatch();
    return (
        <>
            <h2>Reservierung</h2>
            <Switch>
                <Route exact path={`${path}`}>
                    <ReservationIndex />
                </Route>
                <Route path={`${path}/:studyId`}>
                    <Reservation customRecordTypes={ customRecordTypes } />
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

const Reservation = ({ customRecordTypes }) => {
    var { path, url } = useRouteMatch();
    var { studyType, studyId } = useParams();
    var history =  useHistory();

    var [ studyRecord, setStudyRecord ] = useState();
    var [ teamRecords, setTeamRecords ] = useState([]);
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

    useEffect(() => {
        if (studyRecord) {
            agent.fetchExperimentOperatorTeamsForStudy({
                studyId: studyRecord._id,
            })
            .then((response) => {
                setTeamRecords(response.data.data.records);
            })
        }
        else {
            setTeamRecords([]);
        }
    }, [ studyRecord ])

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
                    var nextUrl = up(url, 1) + '/' + nextStudyRecord._id;;
                    history.push(nextUrl)
                }}
            />

            <ReservationTypeNav />
            <Switch>
                <Route exact path={ path }>
                    <Redirect to={`${url}/locations`} />
                </Route>
                <Route path={ `${path}/locations`}>
                    <LocationReservationContainer
                        customRecordTypes={ customRecordTypes }
                        studyRecord={ studyRecord }
                        teamRecords={ teamRecords }
                    />
                </Route>
                <Route path={ `${path}/away-teams`}>
                    <AwayTeamReservation
                        customRecordTypes={ customRecordTypes }
                        studyRecord={ studyRecord }
                        teamRecords={ teamRecords }
                    />
                </Route>
            </Switch>
        </>
    );
}

const LocationReservationContainer = ({
    customRecordTypes,
    studyRecord,
    teamRecords,
}) => {
    var { path, url } = useRouteMatch();
    var { inhouseTestLocationSettings } = studyRecord.state;
   
    if (inhouseTestLocationSettings.length < 1) {
        return (
            <div>no locations available</div>
        )
    }

    var { customRecordTypeId } = inhouseTestLocationSettings[0];
    var { type: locationRecordType } = customRecordTypes.find(it => (
        it._id === customRecordTypeId
    ));

    return (
        <div>
            <LocationTypeNav
                customRecordTypes={ customRecordTypes }
                settingsList={ inhouseTestLocationSettings }
            />
            <Switch> 
                <Route exact path={ path }>
                    <Redirect to={`${url}/${locationRecordType}`} />
                </Route>
                <Route path={ `${path}/:locationRecordType`}>
                    <LocationTypeContainer
                        customRecordTypes={ customRecordTypes }
                        studyRecord={ studyRecord }
                        teamRecords={ teamRecords }
                    />
                </Route>
            </Switch>
        </div>
    );
}

const LocationTypeContainer = ({
    customRecordTypes,
    studyRecord,
    teamRecords,
}) => {
    var { path, url } = useRouteMatch();
    var { locationRecordType } = useParams();

    var locationTypeMetadata = customRecordTypes.find(it => (
        it.type === locationRecordType
    ));
    
    return (
        <LocationCalendarList
            teamRecords={ teamRecords }
            studyId={ studyRecord._id }
            locationRecordTypeId={ locationTypeMetadata._id }
        />
    );
}

/*const LocationContainer = ({
    customRecordTypes,
    locationRecords,
    teamRecords,
}) => {
    var { path, url } = useRouteMatch();
    var { studyId, locationId } = useParams();

    var locationRecord = locationRecords.find(it => (
        it._id === locationId
    ));

    return (
        <>
            <header>
                <b>{ locationRecord._recordLabel }</b>
            </header>

            <LocationCalendar
                teamRecords={ teamRecords }
                locationRecord={ locationRecord }
                studyId={ studyId }
            />

        </>
    );
}*/

const AwayTeamReservation = () => {
    return (
        <div>at</div>
    )
}

import LinkButton from '@mpieva/psydb-ui-lib/src/link-button';
const LocationTypeNav = ({
    customRecordTypes,
    settingsList,
}) => {
    var { path, url } = useRouteMatch();
    var history =  useHistory();
    return (
        <div>
            { settingsList.map(
                ({ customRecordTypeId }) => {
                    var metadata = customRecordTypes.find(it => (
                        it._id === customRecordTypeId
                    ));
                    return (
                        <LinkButton
                            key={ metadata.type }
                            to={ metadata.type }
                        >
                            { metadata.state.label }
                        </LinkButton>
                    );
                }
            )}
        </div>
    )
}

//import LinkButton from '@mpieva/psydb-ui-lib/src/link-button';
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
