import React, { useState, useEffect, useReducer } from 'react';

import {
    Route,
    Switch,
    Redirect,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import { useFetchAll } from '@mpieva/psydb-ui-hooks';
import { LoadingIndicator } from '@mpieva/psydb-ui-layout';
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

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var studyRecord = fetched.study.data.record;
    var teamRecords = fetched.teams.data.records;
    var settingRecords = fetched.labProcedureSettings.data.records;

    settingRecords = settingRecords.filter(it => (
        ['inhouse', 'away-team', 'online-video-call'].includes(it.type)
    ))

    var renderedPicker = (
        <StudyPicker
            studyType={ studyType }
            value={ studyRecord }
            onChange={ (nextStudyRecord) => {
                var nextUrl = up(url, 1) + '/' + nextStudyRecord._id;
                history.push(nextUrl)
            }}
        />
    );

    if (teamRecords.length < 1) {
        return (
            <>
                { renderedPicker }
                <hr />
                <div className='p-3 text-danger'>
                    <b>Keine Experimenter-Teams in dieser Studie</b>
                </div>
            </>
        )
    }
    if (settingRecords.length < 1) {
        return (
            <>
                { renderedPicker }
                <hr />
                <div className='p-3 text-danger'>
                    <b>Für diese Studie ist keine Reservierung möglich</b>
                </div>
            </>
        )
    }

    return (
        <>
            { renderedPicker }
            <hr />
            <Switch>
                <Route exact path={ path }>
                    <Redirect to={`${url}/locations`} />
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
