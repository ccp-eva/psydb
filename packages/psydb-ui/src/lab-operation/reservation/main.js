import React, { useState, useEffect, useReducer } from 'react';

import {
    Route,
    Switch,
    Redirect,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import {
    useFetchAll,
    usePermissions,
} from '@mpieva/psydb-ui-hooks';

import { LoadingIndicator, Alert, Icons } from '@mpieva/psydb-ui-layout';
import { ReservationTypeRouting } from './reservation-type-routing';

import agent from '@mpieva/psydb-ui-request-agents';
import { urlUp as up } from '@mpieva/psydb-ui-utils';
import { RecordPicker } from '@mpieva/psydb-ui-lib';
import { StudyPicker } from './study-picker';

export const Main = ({ customRecordTypes }) => {
    var { path, url } = useRouteMatch();
    var { studyType, studyId } = useParams();
    var history =  useHistory();

    var [ didFetch, fetched ] = useFetchAll((agent) => ({
        study: agent.readRecord({
            collection: 'study',
            recordType: studyType,
            id: studyId,
            additionalParams: {
                labelOnly: true
            }
        }),
        teams: agent.fetchExperimentOperatorTeamsForStudy({
            studyId,
        }),
        labProcedureSettings: agent.fetchExperimentVariantSettings({
            studyId,
        })
    }), [ studyType, studyId ]);

    var permissions = usePermissions();


    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var studyRecord = fetched.study.data.record;
    var teamRecords = fetched.teams.data.records;
    var settingRecords = fetched.labProcedureSettings.data.records;

    settingRecords = settingRecords.filter(it => (
        ['inhouse', 'away-team', 'online-video-call'].includes(it.type)
    ))

    var canReserveLocations = (
        settingRecords.find(it => (
            ['inhouse', 'online-video-call'].includes(it.type)
        ))
        && permissions.hasSomeLabOperationFlags({
            types: [ 'inhouse', 'online-video-call' ],
            flags: [ 'canWriteReservations' ]
        })
    );

    var canReserveTeams = (
        settingRecords.find(it => (
            ['away-team'].includes(it.type)
        ))
        && permissions.hasSomeLabOperationFlags({
            types: [ 'away-team' ],
            flags: [ 'canWriteReservations ']
        })
    );

    var renderedPicker = (
        <>
            <header><b>Studie</b></header>
            <StudyPicker
                studyType={ studyType }
                value={ studyRecord }
                canClear={ false }
                onChange={ (nextStudyRecord) => {
                    var nextUrl = up(url, 1) + '/' + nextStudyRecord._id;
                    history.push(nextUrl)
                }}
            />
        </>
    );

    if (teamRecords.length < 1) {
        return (
            <>
                { renderedPicker }
                <hr />
                <ErrorFallback
                    studyRecord={ studyRecord }
                    urlAffix='/teams'
                >
                    Keine Experimenter-Teams in dieser Studie
                </ErrorFallback>
            </>
        )
    }
    if (settingRecords.length < 1) {
        return (
            <>
                { renderedPicker }
                <hr />
                <ErrorFallback
                    studyRecord={ studyRecord }
                    urlAffix='/experiment-settings'
                >
                    Für diese Studie ist keine Reservierung möglich
                </ErrorFallback>
            </>
        )
    }

    return (
        <>
            { renderedPicker }
            <hr />
            <Switch>
                <Route exact path={ path }>
                    <Redirect to={
                        canReserveLocations
                        ? `${url}/locations`
                        : `${url}/away-teams`
                    } />
                </Route>
                <Route path={`${path}/:navItem`}>
                    <ReservationTypeRouting { ...({
                        customRecordTypes,
                        studyRecord,
                        teamRecords,
                        settingRecords,
                    })} />
                </Route>

            </Switch>
        </>
    );
}

const ErrorFallback = (ps) => {
    var { studyRecord, urlAffix = '', children } = ps;
    var { _id: studyId, type: studyType } = studyRecord;
    return (
        <Alert variant='danger' className='mt-3'>
            { children }
            {' '}
            <a 
                className='text-reset'
                href={`#/studies/${studyType}/${studyId}${urlAffix}`}
            >
                <b>Zu den Studien-Einstellungen</b>
                {' '}
                <Icons.ArrowRightShort style={{
                    height: '20px',
                    width: '20px', marginTop: '-4px'
                }} />
            </a>
        </Alert>
    )
}
