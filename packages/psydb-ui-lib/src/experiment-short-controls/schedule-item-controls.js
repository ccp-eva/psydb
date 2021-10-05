import React from 'react';
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

    if (minEnd === undefined) {
        minEnd = new Date(start.getTime() + slotDuration - 1);
    }

    return (
        <>
            <Pair className='mb-2' label='Datum'>
                { datefns.format(new Date(start), 'P') }
            </Pair>

            <Pair className='mb-2'label='Beginn'>
                { datefns.format(new Date(start), 'p') }
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
