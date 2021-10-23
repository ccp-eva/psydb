import React from 'react';
import { useRouteMatch, useParams } from 'react-router-dom';

import { LoadingIndicator } from '@mpieva/psydb-ui-layout';

import {
    useFetchAll,
    useRevision,
    useModalReducer,
} from '@mpieva/psydb-ui-hooks';

import SelectionSettingsBySubjectType from './selection-settings-by-subject-type';

const StudySelectionSettings = ({
    recordType,
}) => {
    var { path, url } = useRouteMatch();
    var { id } = useParams();

    var { value: revision, up: increaseRevision } = useRevision();

    var [ didFetch, fetched ] = useFetchAll((agent) => ({
        study: agent.readRecord({
            collection: 'study',
            recordType,
            id,
        }),
        studySubjectTypes: agent.fetchSubjectTypeDataForStudy({
            studyId: id,
        }),
    }), [ id, revision ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var studyData = fetched.study.data;
    var studySubjectTypesData = fetched.studySubjectTypes.data;

    var { selectionSettingsBySubjectType } = studyData.record.state;

    return (
        <div className='mt-3 mb-3'>
            <SelectionSettingsBySubjectType { ...({
                settings: selectionSettingsBySubjectType,
                subjectTypeData: studySubjectTypesData.records,
                ...studyData,
                
                onSuccessfulUpdate: increaseRevision,
            }) } />
        </div>
    )
}

export default StudySelectionSettings;
