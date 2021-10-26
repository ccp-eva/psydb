import React from 'react';
import { useRouteMatch, useParams } from 'react-router-dom';

import {
    useFetchAll,
    useRevision,
    useModalReducer,
} from '@mpieva/psydb-ui-hooks';

import { LoadingIndicator } from '@mpieva/psydb-ui-layout';

import {
    NewSelectorModal,
    RemoveSelectorModal,

    NewAgeFrameModal,
    EditAgeFrameModal,
    RemoveAgeFrameModal,
} from './modals';

import SelectorList from './selector-list';

const StudySelectionSettings = ({
    recordType: studyType,
}) => {
    var { path, url } = useRouteMatch();
    var { id: studyId } = useParams();

    var { value: revision, up: increaseRevision } = useRevision();

    var newSelectorModal = useModalReducer();
    var removeSelectorModal = useModalReducer();

    var newAgeFrameModal = useModalReducer();
    var editAgeFrameModal = useModalReducer();
    var removeAgeFrameModal = useModalReducer();

    var [ didFetch, fetched ] = useFetchAll((agent) => {
        var promises = {
            crts: agent.readCustomRecordTypeMetadata(),
            study: agent.readRecord({
                collection: 'study',
                recordType: studyType,
                id: studyId
            }),
            selectors: agent.fetchSubjectSelectors({
                studyId,
            }),
            ageFrames: agent.fetchAgeFrames({
                studyId,
            })
        }
        return promises;
    }, [ studyId, revision ])

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { customRecordTypes } = fetched.crts.data;
    var studyData = fetched.study.data;

    var {
        records: selectorRecords,
        ...selectorRelated
    } = fetched.selectors.data;
    var {
        records: ageFrameRecords,
        ...ageFrameRelated
    } = fetched.ageFrames.data;

    var subjectTypeMap = (
        customRecordTypes
        .filter(it => it.collection === 'subject')
        .reduce((acc, it) => ({
            ...acc,
            [it.type]: it
        }), {})
    );

    return (
        <div className='mt-3 mb-3'>
            
            <NewSelectorModal { ...({
                ...newSelectorModal.passthrough,
                studyId,
                subjectTypeMap,
                
                onSuccessfulUpdate: increaseRevision
            })} />
            
            <RemoveSelectorModal { ...({
                ...removeSelectorModal.passthrough,
                subjectTypeMap,
                onSuccessfulUpdate: increaseRevision
            })} />

            <NewAgeFrameModal { ...({
                ...newAgeFrameModal.passthrough,
                studyId,
                onSuccessfulUpdate: increaseRevision
            })} />

            <EditAgeFrameModal { ...({
                ...editAgeFrameModal.passthrough,
                onSuccessfulUpdate: increaseRevision
            })} />

            <RemoveAgeFrameModal { ...({
                ...removeAgeFrameModal.passthrough,
                onSuccessfulUpdate: increaseRevision
            })} />


            <SelectorList { ...({
                selectorRecords,
                selectorRelated,
                ageFrameRecords,
                ageFrameRelated,

                customRecordTypes,
                subjectTypeMap,

                onAddSelector: newSelectorModal.handleShow,
                onRemoveSelector: removeSelectorModal.handleShow,

                onAddAgeFrame: newAgeFrameModal.handleShow,
                onEditAgeFrame: editAgeFrameModal.handleShow,
                onRemoveAgeFrame: removeAgeFrameModal.handleShow,
            })} />

        </div>
    )
}

export default StudySelectionSettings;
