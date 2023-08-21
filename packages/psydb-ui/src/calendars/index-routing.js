import React from 'react';
import {
    useRouteMatch,
    Route,
    Switch,
   // Redirect, // TODO
} from 'react-router-dom';

import ReceptionCalendar from './reception';
import InviteExperimentsRouting from './invite-experiments';
import AwayTeamExperimentsRouting from './away-team-experiments';

const IndexRouting = (ps) => {
    var {
        groupedCRTs,

        canViewReception,
        canViewInhouse,
        canViewAwayTeam,
        canViewVideo,
    } = ps;

    var { path } = useRouteMatch();

    return (
        <>
            { canViewReception && (
                <Route path={ `${path}/reception` }>
                    <ReceptionCalendar />
                </Route>
            )}
            { canViewInhouse && (
                <Route path={ `${path}/inhouse` }>
                    <InviteExperimentsRouting
                        inviteType='inhouse'
                        subjectRecordTypes={ groupedCRTs.subject }
                    />
                </Route>
            )}
            { canViewAwayTeam && (
                <Route path={ `${path}/away-team` }>
                    <AwayTeamExperimentsRouting
                        locationTypes={ groupedCRTs.location }
                    />
                </Route>
            )}
            { canViewVideo && (
                <Route path={ `${path}/online-video-call` }>
                    <InviteExperimentsRouting
                        inviteType='online-video-call'
                        subjectRecordTypes={ groupedCRTs.subject }
                    />
                </Route>
            )}
        </>
    );
}

export default IndexRouting;
