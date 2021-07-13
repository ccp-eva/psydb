import React from 'react';
import datefns from '@mpieva/psydb-ui-lib/src/date-fns';

import DaysContainer from './days-container';

const groupRecordsByDayStart = ({ allDayStarts, records }) => {
    var groups = {};
    for (var start of allDayStarts) {
        var startT = start.getTime();
        var endT = datefns.endOfDay(start).getTime();
        groups[startT] = records.filter(it => {
            var expStartT = (
                new Date(it.state.interval.start).getTime()
            )
            return (
                expStartT >= startT
                && expStartT <= endT
            )
        })
    }
    return groups;
}

const StudyRow = ({
    allDayStarts,

    studyId,
    studyLabel,
    experimentRecords,
    reservationRecords,

    ...other
}) => {
    
    var experimentsByDayStart = groupRecordsByDayStart({
        allDayStarts,
        records: experimentRecords.filter(it => it.state.studyId === studyId)
    });

    var reservationsByDayStart = groupRecordsByDayStart({
        allDayStarts,
        records: reservationRecords.filter(it => it.state.studyId === studyId)
    });

    return (
        <div className='d-flex'>

            <div className='border bg-light' style={{
                writingMode: 'tb-rl',
                transform: 'rotate(-180deg)',
                textAlign: 'center',
                paddingRight: '5px',
                width: '35px',
            }}>
                <b>{ studyLabel }</b>
            </div>

            <DaysContainer { ...({
                allDayStarts,
                experimentsByDayStart,
                reservationsByDayStart,
                 ...other
            }) } />
        </div>
    )
}

export default StudyRow;
