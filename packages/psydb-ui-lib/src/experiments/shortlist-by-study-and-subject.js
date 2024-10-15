import React from 'react';
import { __fixRelated } from '@mpieva/psydb-common-compat';
import { useUITranslation, useUILocale } from '@mpieva/psydb-ui-contexts';
import { useFetch } from '@mpieva/psydb-ui-hooks';
import { LoadingIndicator } from '@mpieva/psydb-ui-layout';

import formatInterval from '../format-date-interval';

const ShortListByStudyAndSubject = (ps) => {
    var { studyId, subjectId, revision } = ps;

    var translate = useUITranslation();

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.fetchSubjectExperiments({
            subjectId, studyId,
        })
    ), [ studyId, subjectId, revision ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { records, related } = __fixRelated(fetched.data)
    if (records.length < 1) {
        return (
            <i className='text-muted'>{ translate('None') }</i>
        )
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

    var locale = useUILocale();
    var { startDate } = formatInterval(interval, { locale });
    
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
