import React from 'react';
import { NBSP } from '@mpieva/psydb-ui-layout';
import formatInterval from './format-date-interval';

const SubjectTestableIntervals = (ps) => {
    var {
        studyLabel,
        desiredTestInterval,
        testableIntervals
    } = ps;

    var desired = asTimestamps(desiredTestInterval);
    console.log({ desired });

    var indicator = '';
    for (var it of testableIntervals) {
        var testable = asTimestamps(it);
        console.log({ testable });
        var isSameStart = desired.start === testable.start;
        var isSameEnd = desired.end === testable.end;

        var formatted = formatInterval(it);
        if (isSameStart && isSameEnd) {
            indicator += '';
        }
        else if (isSameStart) {
            indicator += `[...${formatted.endDate}]`;
        }
        else if (isSameEnd) {
            indicator += `[${formatted.startDate}...]`;
        }
        else {
            indicator += `[${formatted.startDate}...${formatted.endDate}]`;
        }
    }

    return (
        <div>
            { studyLabel }
            { indicator && (
                <>
                    <NBSP />
                    { indicator }
                </>
            )}
        </div>
    )
}

var asTimestamps = ({ start, end }) => ({
    start: new Date(start).getTime(),
    end: new Date(end).getTime(),
})

export default SubjectTestableIntervals;
