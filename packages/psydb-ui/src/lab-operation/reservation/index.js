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
import up from '@mpieva/psydb-ui-lib/src/url-up';

import TabNav from '@mpieva/psydb-ui-lib/src/tab-nav';
import StudyInhouseLocationTypeNav from '@mpieva/psydb-ui-lib/src/study-inhouse-location-type-nav';

import LocationTypeContainer from './location-type-container';
import RecordPicker from '@mpieva/psydb-ui-lib/src/record-picker';
//import LocationCalendarList from './location-calendar-list';

import AwayTeams from './away-teams';

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

            <Switch>
                <Route exact path={ path }>
                    <Redirect to={`${url}/locations`} />
                </Route>
                <Route path={`${path}/:navItem`}>
                    <ReservationTypeContainer
                        customRecordTypes={ customRecordTypes }
                        studyRecord={ studyRecord }
                        teamRecords={ teamRecords }
                    />
                </Route>

            </Switch>
        </>
    );
}

const ReservationTypeContainer = (ps) => {
    var { path, url } = useRouteMatch();
    var { navItem } = useParams();
    var history =  useHistory();

    return (
        <>
            <TabNav
                className='d-flex'
                itemClassName='flex-grow'
                items={[
                    { key: 'locations', label: 'Räumlichkeiten' },
                    { key: 'away-teams', label: 'Aussen-Teams' },
                ]}
                activeKey={ navItem }
                onItemClick={ (nextKey) => {
                    history.push(`${up(url, 1)}/${nextKey}`);
                }}
            />
            { navItem === 'locations' && (
                <LocationReservationContainer { ...ps } />
            )}
            { navItem === 'away-teams' && (
                <AwayTeamReservation { ...ps } />
            )}
        </>
    )
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

    var { customRecordType } = inhouseTestLocationSettings[0];

    return (
        <div className='border p-2 border-top-0'>
            <Switch> 
                <Route exact path={ path }>
                    <Redirect to={`${url}/${customRecordType}`} />
                </Route>
                <Route path={ `${path}/:locationRecordType`}>
                    <LocationTypeContainer
                        studyRecord={ studyRecord }
                        teamRecords={ teamRecords }
                        customRecordTypeData={ customRecordTypes }
                    />
                </Route>
            </Switch>
        </div>
    );
}



const AwayTeamReservation = () => {
    return (
        <AwayTeams />
    )
}

export default ReservationRouting;
