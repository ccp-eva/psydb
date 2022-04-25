import React from 'react';
import { fixRelated } from '@mpieva/psydb-ui-utils';
import { useFetch } from '@mpieva/psydb-ui-hooks';
import { LoadingIndicator } from '@mpieva/psydb-ui-layout';

import formatInterval from '../format-date-interval';

const ShortListByStudyAndSubject = (ps) => {
    var { studyId, subjectId, revision } = ps;

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.fetchSubjectExperiments({
            subjectId, studyId,
        })
    ), [ studyId, subjectId, revision ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { records, related } = fixRelated(fetched.data)
    if (records.length < 1) {
        return <i className='text-muted'>Keine</i>
    }

    return (
        <>
            { records.map((it, ix) => (
                <Item
                    key={ ix }
                    record={ it }
                    related={ related }
                    showStudyLabel={ !studyId }
                />
            ))}
        </>
    );
}

const Item = (ps) => {
    var { record, related, showStudyLabel = true } = ps;
    var { interval, studyId } = record.state;
    var { startDate } = formatInterval(interval);
    
    var uri = `#/experiments/${record.type}/${record._id}`;

    return (
        <a href={ uri } className='d-inline-block mr-3'>
            { startDate }
            { showStudyLabel && (
                <>
                    {' '}
                    ({ related.records.study[studyId]._recordLabel })
                </>
            )}
        </a>
    )
}

export default ShortListByStudyAndSubject; 
