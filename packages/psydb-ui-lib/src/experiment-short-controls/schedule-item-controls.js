import React from 'react';
import { useUITranslation, useUILocale } from '@mpieva/psydb-ui-contexts';
import { Pair } from '@mpieva/psydb-ui-layout';

import datefns from '../date-fns';

import {
    EndControl,
    TeamControl
} from './schedule-item-fields';

const ScheduleItemControls = (ps) => {
    var {
        start,
        end,
        minEnd,
        maxEnd,
        slotDuration,

        teamId,
        teamRecords,

        onChangeEnd,
        onChangeTeamId,
    } = ps;

    var locale = useUILocale();
    var translate = useUITranslation();

    if (minEnd === undefined) {
        minEnd = new Date(start.getTime() + slotDuration - 1);
    }

    return (
        <>
            <Pair className='mb-2' label={ translate('Date') }>
                { datefns.format(new Date(start), 'P', { locale }) }
            </Pair>

            <Pair className='mb-2'label={ translate('Start') }>
                { datefns.format(new Date(start), 'p', { locale }) }
            </Pair>

            <EndControl { ...({
                end,
                minEnd,
                maxEnd,
                slotDuration,
                onChangeEnd,
            })} />

            { teamRecords && (
                <TeamControl { ...({
                    teamId,
                    teamRecords,
                    onChangeTeamId
                })} />
            )}
        </>
    );
}

export default ScheduleItemControls;
