import React from 'react';

import datefns from '../date-fns';
import Pair from '../pair';

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
