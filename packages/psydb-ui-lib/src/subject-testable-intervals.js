import React from 'react';
import { NBSP } from '@mpieva/psydb-ui-layout';
import intervalfns from '@mpieva/psydb-date-interval-fns';

const SubjectTestableIntervals = (ps) => {
    var {
        studyLabel,
        desiredTestInterval,
        testableIntervals
    } = ps;

    var desired = intervalfns.dtoi(desiredTestInterval);
    //console.log({ desired });

    var indicator = '';
    for (var it of testableIntervals) {
        var testable = intervalfns.dtoi(it);
        //console.log({ testable });
        var isSameStart = desired.start === testable.start;
        var isSameEnd = desired.end === testable.end;

        var formatted = intervalfns.format(it);
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

export default SubjectTestableIntervals;
