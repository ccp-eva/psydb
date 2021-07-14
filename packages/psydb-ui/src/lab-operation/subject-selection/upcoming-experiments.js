import React from 'react';
import datefns from '@mpieva/psydb-ui-lib/src/date-fns';

const UpcomingExperiments = ({
    records,
    relatedRecordLabels,
    relatedHelperSetItems,
    relatedCustomRecordTypeLabels,
}) => {
    var upcoming = (
        records.map((record) => {
            var start = datefns.format(new Date(record.state.interval.start), 'P');
            var study = relatedRecordLabels.study[record.state.studyId]._recordLabel;
            return `${study} ${start}`;
        })
    );

    return (
        records.length > 0
        ? <span>{ upcoming.join(', ') }</span>
        : null
    )
}

export default UpcomingExperiments;
