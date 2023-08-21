import React from 'react';
import {
    useRouteMatch,
    Route,
    Switch,
   // Redirect, // TODO
} from 'react-router-dom';

import { RedirectOrTypeNav } from '@mpieva/psydb-ui-lib';

import ReservationRouting from './reservation';
import SubjectSelectionRouting from './subject-selection';
import InviteConfirmationRouting from './invite-confirmation';
import ExperimentPostprocessingRouting from './experiment-postprocessing';

const IndexRouting = (ps) => {
    var {
        customRecordTypes, // FIXME
        groupedCRTs,

        canWriteReservations,
        canSelectSubjects,
        canConfirmInvitations,
        canPostprocess,
    } = ps;

    var { url, path } = useRouteMatch();

    return (
        <>
            { canWriteReservations && (
                <Route exact path={`${path}/reservation`}>
                    <RedirectOrTypeNav
                        baseUrl={ `${url}/reservation` }
                        recordTypes={ groupedCRTs.study }
                    />
                </Route>
            )}
            { canWriteReservations && (
                <Route path={`${path}/reservation/:studyType`}>
                    <ReservationRouting customRecordTypes={
                        customRecordTypes
                    } />
                </Route>
            )}

            { canSelectSubjects && (
                <Route exact path={`${path}/subject-selection`}>
                    <RedirectOrTypeNav
                        baseUrl={ `${url}/subject-selection` }
                        recordTypes={ groupedCRTs.study }
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
                        recordTypes={ groupedCRTs.study }
                    />
                </Route>
            )}
            { canConfirmInvitations && (
                <Route path={`${path}/invite-confirmation/:studyType`}>
                    <InviteConfirmationRouting
                        subjectRecordTypes={ groupedCRTs.subject }
                    />
                </Route>
            )}

            { canPostprocess && (
                <Route exact path={`${path}/experiment-postprocessing`}>
                    <RedirectOrTypeNav
                        baseUrl={ `${url}/experiment-postprocessing` }
                        recordTypes={ groupedCRTs.study }
                    />
                </Route>
            )}
            { canPostprocess && (
                <Route path={`${path}/experiment-postprocessing/:studyType`}>
                    <ExperimentPostprocessingRouting
                        subjectRecordTypes={ groupedCRTs.subject }
                    />
                </Route>
            )}
    </>
    );
}

export default IndexRouting;
