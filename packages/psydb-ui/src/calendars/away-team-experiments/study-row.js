import React from 'react';
import { groupBy } from '@mpieva/psydb-core-utils';
import { dtoi } from '@mpieva/psydb-date-interval-fns';

import DaysContainer from './days-container';

const StudyRow = (ps) => {
    var {
        allDays,

        studyId,
        studyLabel,
        experimentRecords,
        reservationRecords,

        ...other
    } = ps;
   
    var buckets = allDays.reduce((acc, day) => ({
        ...acc,
        [day.start.getTime()]: []
    }), {});

    var compareStudyIds = (it) => (
        it.state.studyId === studyId
    )

    var experimentsByDayStart = groupBy({
        items: experimentRecords.filter(compareStudyIds),
        createKey: (it) => dtoi(it.state.interval).start
    });

    var reservationsByDayStart = groupBy({
        items: reservationRecords.filter(compareStudyIds),
        createKey: (it) => dtoi(it.state.interval).start
    });

    return (
        <div className='d-flex'>

            <div className='border bg-light' style={{
                writingMode: 'tb-rl',
                transform: 'rotate(-180deg)',
                textAlign: 'center',
                paddingRight: '5px',
                paddingTop: '5px',
                paddingBottom: '5px',
                width: '35px',
            }}>
                <b>{ studyLabel }</b>
            </div>

            <DaysContainer { ...({
                allDays,
                experimentsByDayStart,
                reservationsByDayStart,
                 ...other
            }) } />
        </div>
    )
}

export default StudyRow;
