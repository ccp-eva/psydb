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
import LocationCalendar from './location-calendar';

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
                    />
                </Route>
                <Route path={ `${path}/away-teams`}>
                    <AwayTeamReservation
                        customRecordTypes={ customRecordTypes }
                        studyRecord={ studyRecord }
                    />
                </Route>
            </Switch>
        </>
    );
}

const LocationReservationContainer = ({
    customRecordTypes,
    studyRecord
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
                    />
                </Route>
            </Switch>
        </div>
    );
}

const LocationTypeContainer = ({
    customRecordTypes,
    studyRecord,
}) => {
    var { path, url } = useRouteMatch();
    var { locationRecordType } = useParams();

    var locationTypeMetadata = customRecordTypes.find(it => (
        it.type === locationRecordType
    ));
    
    var { inhouseTestLocationSettings } = studyRecord.state;
    /*var locationTypeSettings = inhouseTestLocationSettings.find(it => (
        it.customRecordTypeId === locationTypeMetadata._id
    ));

    console.log(locationTypeSettings)*/

    /*var {
        customRecordTypeId,
        enableAllAvailableLocations,
        enabledLocationIds,
    } = locationTypeSettings;*/

    var [ isInitialized, setIsInitialized ] = useState(false);
    var [ locationRecords, setLocationRecords ] = useState([]);
    useEffect(() => {
        agent.fetchAvailableTestLocationsForStudy({
            studyId: studyRecord._id,
            locationRecordTypeId: locationTypeMetadata._id
        })
        .then((response) => {
            setLocationRecords(response.data.data.records);
        })
    }, [ studyRecord, locationRecordType ]);

    if (locationRecords.length < 1) {
        return (
            <div>no locations available</div>
        )
    }

    return (
        <Switch>
            <Route exact path={ path }>
                <Redirect to={`${url}/${locationRecords[0]._id}`} />
            </Route>
            <Route path={ `${path}/:locationId`}>
                <LocationContainer
                    customRecordTypes={ customRecordTypes }
                    studyRecord={ studyRecord }
                    locationRecords={ locationRecords }
                />
            </Route>
        </Switch>
    );
}

const LocationContainer = ({
    customRecordTypes,
    locationRecords,
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
                locationRecord={ locationRecord }
                studyId={ studyId }
            />
        </>
    );
}

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
