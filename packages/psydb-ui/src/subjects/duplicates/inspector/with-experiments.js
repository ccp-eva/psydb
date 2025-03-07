import React from 'react';
import { __fixRelated } from '@mpieva/psydb-common-compat';
import { useFetchAll } from '@mpieva/psydb-ui-hooks';
import { LoadingIndicator } from '@mpieva/psydb-ui-layout';

const withExperiments = () => (NextComponent) => {
    var WithExperiments = (ps) => {
        var { revision, selection } = ps;
        var { leftId, rightId } = selection.state;

        var [ didFetch, fetched ] = useFetchAll((agent) => ({
            [leftId]: agent.fetchSubjectExperiments({ subjectId: leftId }),
            [rightId]: agent.fetchSubjectExperiments({ subjectId: rightId }),
        }), [ leftId, rightId, revision.value ]);

        if (!didFetch) {
            return <LoadingIndicator size='xl' />
        }

        var left = __fixRelated(fetched[leftId].data);
        var right = __fixRelated(fetched[rightId].data);
      
        var now = new Date();
        left = { ...left, ...split({ records: left.records, now }) };
        right = { ...right, ...split({ records: right.records, now }) };

        var bag = { leftExperiments: left, rightExperiments: right };
        return <NextComponent { ...ps } { ...bag } />
    }

    return WithExperiments;
}

const split = (bag) => {
    var { records, now } = bag;

    var past = [];
    var future = [];
    for (var it of records) {
        var { interval } = it.state;
        ((new Date(interval.end) < now) ? past : future).push(it);
    }

    return { past, future }
}

export default withExperiments;
