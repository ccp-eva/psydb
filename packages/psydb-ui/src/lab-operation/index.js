import React, { useState, useEffect } from 'react';
import { usePermissions } from '@mpieva/psydb-ui-hooks';

import {
    Route,
    Switch,
    Redirect,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import agent from '@mpieva/psydb-ui-request-agents';
import { urlUp as up } from '@mpieva/psydb-ui-utils';
import { BigNav, PageWrappers } from '@mpieva/psydb-ui-layout';
import RecordTypeNav from '@mpieva/psydb-ui-lib/src/record-type-nav';

import ReservationRouting from './reservation';
import SubjectSelectionRouting from './subject-selection';
import InviteConfirmationRouting from './invite-confirmation';
import ExperimentPostprocessingRouting from './experiment-postprocessing';

const LabOperation = () => {
    var { path, url } = useRouteMatch();
    var permissions = usePermissions();

    var [ isInitialized, setIsInitialized ] = useState(false);
    var [ metadata, setMetadata ] = useState();

    useEffect(() => {
        agent.readCustomRecordTypeMetadata().then(
            (response) => {
                setMetadata(response.data.data);
                setIsInitialized(true)
            }
        )
    }, [])

    if (!isInitialized) {
        return (
            <div>Loading...</div>
        );
    }

    var studyTypes = (
        metadata.customRecordTypes.filter(it => (
            it.collection ===  'study'
        ))
    );

    var subjectTypes = (
        metadata.customRecordTypes.filter(it => (
            it.collection ===  'subject'
        ))
    );

    var canWriteReservations = permissions.hasSomeLabOperationFlags({
        types: 'any', flags: [ 'canWriteReservations' ],
    });
    var canSelectSubjects = permissions.hasSomeLabOperationFlags({
        types: 'any', flags: [
            'canSelectSubjectsForExperiments',
            'canPerformOnlineSurveys'
        ],
    });
    var canConfirmInvitations = permissions.hasSomeLabOperationFlags({
        types: 'any', flags: [ 'canConfirmSubjectInvitation' ],
    });
    var canPostprocess = permissions.hasSomeLabOperationFlags({
        types: 'any', flags: [ 'canPostprocessExperiments' ],
    });


    return (
        <PageWrappers.Level1 title='Studienbetrieb'>
            <Switch>
                <Route exact path={`${path}`}>
                    <RedirectOrTypeNav
                        baseUrl={ `${url}/index` }
                        studyTypes={ studyTypes }
                    />
                </Route>
                <Route exact path={`${path}/index/:studyType`}>
                    <OperationNav {...({
                        canWriteReservations,
                        canSelectSubjects,
                        canConfirmInvitations,
                        canPostprocess,
                    })} />
                </Route>

                { canWriteReservations && (
                    <Route exact path={`${path}/reservation`}>
                        <RedirectOrTypeNav
                            baseUrl={ `${url}/reservation` }
                            studyTypes={ studyTypes }
                        />
                    </Route>
                )}
                { canWriteReservations && (
                    <Route path={`${path}/reservation/:studyType`}>
                        <ReservationRouting customRecordTypes={
                            metadata.customRecordTypes
                        } />
                    </Route>
                )}

                { canSelectSubjects && (
                    <Route exact path={`${path}/subject-selection`}>
                        <RedirectOrTypeNav
                            baseUrl={ `${url}/subject-selection` }
                            studyTypes={ studyTypes }
                        />
                    </Route>
                )}
                { canSelectSubjects && (
                    <Route path={`${path}/subject-selection/:studyType`}>
                        <SubjectSelectionRouting />
                    </Route>
                )}

                { canConfirmInvitations && (
                    <Route exact path={`${path}/invite-confirmation`}>
                        <RedirectOrTypeNav
                            baseUrl={ `${url}/invite-confirmation` }
                            studyTypes={ studyTypes }
                        />
                    </Route>
                )}
                { canConfirmInvitations && (
                    <Route path={`${path}/invite-confirmation/:studyType`}>
                        <InviteConfirmationRouting
                            subjectRecordTypes={ subjectTypes }
                        />
                    </Route>
                )}

                { canPostprocess && (
                    <Route exact path={`${path}/experiment-postprocessing`}>
                        <RedirectOrTypeNav
                            baseUrl={ `${url}/experiment-postprocessing` }
                            studyTypes={ studyTypes }
                        />
                    </Route>
                )}
                { canPostprocess && (
                    <Route path={`${path}/experiment-postprocessing/:studyType`}>
                        <ExperimentPostprocessingRouting
                            subjectRecordTypes={ subjectTypes }
                        />
                    </Route>
                )}

            </Switch>
        </PageWrappers.Level1>
    )
}

const RedirectOrTypeNav = ({
    baseUrl,
    studyTypes,
    title,
}) => {
    if (studyTypes.length === 1) {
        return (
            <Redirect to={
                `${baseUrl}/${studyTypes[0].type}`
            } />
        )
    }
    else {
        return (
            <>
                { title && (
                    <h2>{ title }</h2>
                )}
                <RecordTypeNav items={ studyTypes } />
            </>
        )
    }
}

const OperationNav = (ps) => {
    var { path, url } = useRouteMatch();
    var { studyType } = useParams();

    var {
        canWriteReservations,
        canSelectSubjects,
        canConfirmInvitations,
        canPostprocess,
    } = ps;

    var baseUrl = up(url, 2);

    var navItems = [
        (canWriteReservations && { 
            label: 'Reservierung',
            linkUrl: `${baseUrl}/reservation/${studyType}`,
        }),
        (canSelectSubjects && {
            label: 'Proband:innenauswahl',
            linkUrl: `${baseUrl}/subject-selection/${studyType}`,
        }),
        (canConfirmInvitations && {
            label: 'Terminbestätigung',
            linkUrl: `${baseUrl}/invite-confirmation/${studyType}`,
        }),
        (canPostprocess && {
            label: 'Nachbereitung',
            linkUrl: `${baseUrl}/experiment-postprocessing/${studyType}`,
        }),
    ].filter(it => !!it)

    return (
        <BigNav items={ navItems } />
    );
}

export default LabOperation;
