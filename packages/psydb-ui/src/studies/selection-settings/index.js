import React from 'react';
import { useParams } from 'react-router-dom';

import {
    useFetch,
    useRevision,
} from '@mpieva/psydb-ui-hooks';

import { LoadingIndicator } from '@mpieva/psydb-ui-layout';
import SubjectTypeSettings from './subject-type-settings';
import StudyExclusion from './study-exclusion';

const SelectionSettings = (ps) => {
    var { recordType: studyType } = ps;
    var { id: studyId } = useParams();
    
    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.readRecord({
            collection: 'study',
            recordType: studyType,
            id: studyId
        })
    ), [ studyId, studyType ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var {
        record: studyRecord,
        ...studyRelated
    } = fetched.data;

    return (
        <>
            <h5 className='mt-3 mb-2 border-bottom pb-1'>
                Allgemeine Bedingungen
            </h5>
            <div className='mb-3 p-3 border bg-white'>
                <StudyExclusion {...({
                    studyId,
                    studyType,
                    studyRecord,
                    studyRelated
                })} />
            </div>
            <h5 className='mb-2 border-bottom pb-1'>
                Probandenspezifische Bedingungen
            </h5>
            <div className='mb-3'>
                <SubjectTypeSettings studyId={ studyId } />
            </div>
        </>
    )
}

export default SelectionSettings;
