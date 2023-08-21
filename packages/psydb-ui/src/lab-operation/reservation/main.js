import React from 'react';

import {
    Route,
    Switch,
    Redirect,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import { urlUp as up } from '@mpieva/psydb-ui-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useFetchAll } from '@mpieva/psydb-ui-hooks';
import { LoadingIndicator } from '@mpieva/psydb-ui-layout';

import { checkTeamsReservable, checkLocationsReservable } from '../utils';

import usePFlags from './use-pflags';
import LabMethodSettingsError from './lab-method-settings-error';
import ReservationTypeRouting from './reservation-type-routing';
import StudyPicker from './study-picker';

const Main = (ps) => {
    var { customRecordTypes } = ps;

    var translate = useUITranslation();
    var pflags = usePFlags();

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
        labTeams: agent.fetchExperimentOperatorTeamsForStudy({
            studyId,
        }),
        labMethodSettings: agent.fetchExperimentVariantSettings({
            studyId,
        })
    }), [ studyType, studyId ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var {
        study,
        labTeams,
        labMethodSettings
    } = fetched._stageDatas;

    var studyRecord = study.record;
    var teamRecords = labTeams.records;
    var settingRecords = labMethodSettings.records;

    // FIXME: pass types to api maybe?
    settingRecords = settingRecords.filter(it => (
        ['inhouse', 'away-team', 'online-video-call'].includes(it.type)
    ))

    var canReserveLocations = (
        checkLocationsReservable(settingRecords)
        && pflags.has('canReserveLocations')
    );

    var canReserveTeams = (
        checkTeamsReservable(settingRecords)
        && pflags.has('canReserveTeams')
    );

    var renderedPicker = (
        <>
            <header><b>
                { translate('Study') }
            </b></header>
            <StudyPicker
                collection='study'
                recordType={ studyType }
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
                <LabMethodSettingsError
                    studyRecord={ studyRecord }
                    urlAffix='/teams'
                >
                    { translate('No lab teams exist for this study.')}
                </LabMethodSettingsError>
            </>
        )
    }
    if (settingRecords.length < 1) {
        return (
            <>
                { renderedPicker }
                <hr />
                <LabMethodSettingsError
                    studyRecord={ studyRecord }
                    urlAffix='/experiment-settings'
                >
                    { translate(
                        'Reservations are not available for this study.'
                    )}
                </LabMethodSettingsError>
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
                        canReserveLocations,
                        canReserveTeams,
                        
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

export default Main;
