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
import { TabNav } from '@mpieva/psydb-ui-layout';
import { LocationTypeRouting } from './location-type-routing';
import { AwayTeamRouting } from './away-team-routing';

export const ReservationTypeRouting = (ps) => {
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
                <LocationTypeRouting { ...ps } />
            )}
            { navItem === 'away-teams' && (
                <AwayTeamRouting { ...ps } />
            )}
        </>
    )
}
