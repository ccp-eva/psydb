import React from 'react';
import { __fixRelated } from '@mpieva/psydb-common-compat';
import { useFetchAll } from '@mpieva/psydb-ui-hooks';
import { LoadingIndicator } from '@mpieva/psydb-ui-layout';

const withExperiments = () => (NextComponent) => {
    var WithExperiments = (ps) => {
        var { fullRevision, subjectRecords, selection } = ps;
        var { leftId, rightId } = selection.state;

        var subjectIds = subjectRecords.map(it => it._id);

        // XXX: useFetchAll cann not reset didFetch which would be required
        // to be able to only fetch leftId/rightId
        var [ didFetch, fetched ] = useFetchAll((agent) => {
            var promises = {}
            for (var it of subjectIds) {
                promises[it] = agent.fetchSubjectExperiments({
                    subjectId: it
                });
            }
            return promises;
        }, [ subjectIds.join(','), fullRevision.value ]);

        if (!didFetch) {
            return <LoadingIndicator size='xl' />
        }

        var now = new Date();
        var bag = {};
        if (leftId) {
            var left = __fixRelated(fetched[leftId].data);
            left = { ...left, ...split({ records: left.records, now }) };
            bag.leftExperiments = left;
        }
        if (rightId) {
            var right = __fixRelated(fetched[rightId].data);
            right = { ...right, ...split({ records: right.records, now }) };
            bag.rightExperiments = right;
        }
        return <NextComponent { ...ps } { ...bag } />
    }

    return WithExperiments;
}

const split = (bag) => {
    var { records, now } = bag;

    var past = [];
    var future = [];
    for (var it of records) {
        var { interval, isPostprocessed } = it.state;
        var target = (
            new Date(interval.end) < now && isPostprocessed
            ? past : future
        ).push(it);
    }

    return { past, future }
}

export default withExperiments;
