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
import { usePermissions } from '@mpieva/psydb-ui-hooks';
import { TabNav } from '@mpieva/psydb-ui-layout';
import { LocationTypeRouting } from './location-type-routing';
import { AwayTeamRouting } from './away-team-routing';

export const ReservationTypeRouting = (ps) => {
    var {
        settingRecords
    } = ps;

    var { path, url } = useRouteMatch();
    var { navItem } = useParams();
    var history =  useHistory();
    var permissions = usePermissions();

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
            flags: [ 'canWriteReservations']
        })
    );

    var tabs = [];
    if (canReserveLocations) {
        tabs.push({ key: 'locations', label: 'Räumlichkeiten' });
    }
    if (canReserveTeams) {
        tabs.push({ key: 'away-teams', label: 'Aussen-Teams' });
    }

    return (
        <>
            <TabNav
                className='d-flex'
                itemClassName='flex-grow'
                items={ tabs }
                activeKey={ navItem }
                onItemClick={ (nextKey) => {
                    history.push(`${up(url, 1)}/${nextKey}`);
                }}
            />
            { canReserveLocations && navItem === 'locations' && (
                <LocationTypeRouting { ...ps } />
            )}
            { canReserveTeams && navItem === 'away-teams' && (
                <AwayTeamRouting { ...ps } />
            )}
        </>
    )
}
