import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { Pair } from '@mpieva/psydb-ui-layout';

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

    var [{ translate, fdate }] = useI18N();

    if (minEnd === undefined) {
        minEnd = new Date(start.getTime() + slotDuration - 1);
    }

    return (
        <>
            <Pair className='mb-2' label={ translate('Date') }>
                { fdate(start, 'P') }
            </Pair>

            <Pair className='mb-2'label={ translate('Start') }>
                { fdate(start, 'p') }
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
