import React from 'react';
import { useRouteMatch, useParams } from 'react-router-dom';

import { LoadingIndicator } from '@mpieva/psydb-ui-layout';

import {
    useFetchAll,
    useRevision,
    useModalReducer,
} from '@mpieva/psydb-ui-hooks';

import SelectionSettingsBySubjectType from './selection-settings-by-subject-type';

import AddSubjectTypeModal from './add-subject-type-modal';
import ConditionsByAgeFrameModal from './conditions-by-age-frame-modal';

const StudySelectionSettings = ({
    recordType,
}) => {
    var { path, url } = useRouteMatch();
    var { id } = useParams();

    var { value: revision, up: increaseRevision } = useRevision();

    var addSubjectTypeModal = useModalReducer();
    var conditionsByAgeFrameModal = useModalReducer();

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
            
            <AddSubjectTypeModal { ...({
                ...addSubjectTypeModal.passthrough,
                ...studyData,
                
                onSuccessfulUpdate: increaseRevision
            })} />
            
            <ConditionsByAgeFrameModal { ...({
                ...conditionsByAgeFrameModal.passthrough,
                studyData,
                
                onSuccessfulUpdate: increaseRevision
            })} />

            <SelectionSettingsBySubjectType { ...({
                settings: selectionSettingsBySubjectType,
                subjectTypeData: studySubjectTypesData.records,
                studyData,
                
                onAddSubjectType: addSubjectTypeModal.handleShow,
                onAddAgeFrame: conditionsByAgeFrameModal.handleShow,
                onEditAgeFrame: conditionsByAgeFrameModal.handleShow,
                onSuccessfulUpdate: increaseRevision,
            }) } />
        </div>
    )
}

export default StudySelectionSettings;
