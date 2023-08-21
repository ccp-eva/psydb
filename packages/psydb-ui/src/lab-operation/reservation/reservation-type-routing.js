import React from 'react';

import {
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import { only } from '@mpieva/psydb-core-utils';
import { urlUp as up } from '@mpieva/psydb-ui-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { TabNav } from '@mpieva/psydb-ui-layout';

import LocationTypeRouting from './location-type-routing';
import { AwayTeamRouting } from './away-team-routing';


const ReservationTypeRouting = (ps) => {
    var {
        canReserveLocations,
        canReserveTeams,
    } = ps;

    var pass = only({ from: ps, paths: [
        'customRecordTypes',
        'studyRecord',
        'teamRecords',
        'settingRecords',
    ]});

    var { path, url } = useRouteMatch();
    var { navItem } = useParams();
    var history =  useHistory();
    
    var translate = useUITranslation();

    var tabs = [];
    if (canReserveLocations) {
        tabs.push({
            key: 'locations',
            label: translate('reservable_locations')
        });
    }
    if (canReserveTeams) {
        tabs.push({
            key: 'away-teams',
            label: translate('Away Teams')
        });
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
                <LocationTypeRouting { ...pass } />
            )}
            { canReserveTeams && navItem === 'away-teams' && (
                <AwayTeamRouting { ...pass } />
            )}
        </>
    )
}

export default ReservationTypeRouting;
