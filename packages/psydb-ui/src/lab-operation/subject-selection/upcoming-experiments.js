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
            var { _id, type, state } = record;
            var start = datefns.format(new Date(state.interval.start), 'P');
            var study = relatedRecordLabels.study[state.studyId]._recordLabel;
            return {
                id: _id,
                type,
                label: `${study} ${start}`
            };
        })
    );

    return (
        records.length > 0
        ? upcoming.map((it, ix) => (
            <a 
                key={ ix }
                href={`#/experiments/${it.type}/${it.id}`}
                target='_blank'
            >
                { it.label }{ ix === upcoming.length - 1 ? '' : ',' }
            </a>
        ))
        : null
    )
}

export default UpcomingExperiments;
