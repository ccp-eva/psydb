import React from 'react';
import { useRouteMatch, useParams } from 'react-router-dom';

import {
    useFetchAll,
    useRevision,
    useModalReducer,
    usePermissions,
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

const SubjectTypeSettings = (ps) => {
    var { studyId } = ps;

    var { value: revision, up: increaseRevision } = useRevision();
    var permissions = usePermissions();

    var [ modalHooks, modalCallbacks ] = useAllModals();

    var [ didFetch, fetched ] = useFetchAll((agent) => {
        var promises = {
            availableSubjectCRTs: agent.fetchStudyAvailableSubjectCRTs({
                studyId,
            }),
            selectors: agent.fetchSubjectSelectors({ studyId }),
            ageFrames: agent.fetchAgeFrames({ studyId })
        }
        return promises;
    }, [ studyId, revision ])

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var availableSubjectCRTs = fetched.availableSubjectCRTs.data.crts;

    var {
        records: selectorRecords,
        ...selectorRelated
    } = fetched.selectors.data;
    var {
        records: ageFrameRecords,
        ...ageFrameRelated
    } = fetched.ageFrames.data;

    var existingSubjectTypes = (
        selectorRecords.map(it => it.subjectTypeKey)
    );
    var hasNoTypesLeft = (
        availableSubjectCRTs.items().length <= existingSubjectTypes.length
    );

    var canWrite = permissions.hasFlag('canWriteStudies');

    var modalBag = {
        studyId,
        existingSubjectTypes,
        availableSubjectCRTs,
        
        onSuccessfulUpdate: increaseRevision
    }

    return (
        <div>
            <AllModals
                { ...modalHooks }
                { ...modalBag }
            />

            <SelectorList { ...({
                selectorRecords,
                selectorRelated,
                ageFrameRecords,
                ageFrameRelated,

                availableSubjectCRTs,

                disableAddSelector: hasNoTypesLeft,
                ...(canWrite && modalCallbacks)
            })} />
        </div>
    )
}

var AllModals = (ps) => {
    var {
        studyId,
        existingSubjectTypes,
        availableSubjectCRTs,
        onSuccessfulUpdate,

        newSelectorModal,
        removeSelectorModal,

        newAgeFrameModal,
        editAgeFrameModal,
        removeAgeFrameModal,
    } = ps;
    
    var shared = { onSuccessfulUpdate }

    return (
        <>
            <NewSelectorModal { ...({
                ...newSelectorModal.passthrough,
                ...shared,
                studyId,
                existingSubjectTypes,
                availableSubjectCRTs,
            })} />
            
            <RemoveSelectorModal { ...({
                ...removeSelectorModal.passthrough,
                ...shared,
                availableSubjectCRTs,
            })} />

            <NewAgeFrameModal { ...({
                ...newAgeFrameModal.passthrough,
                ...shared,
                studyId,
            })} />

            <EditAgeFrameModal { ...({
                ...editAgeFrameModal.passthrough,
                ...shared,
            })} />

            <RemoveAgeFrameModal { ...({
                ...removeAgeFrameModal.passthrough,
                ...shared,
            })} />
        </>
    )
}

var useAllModals = (ps) => {
    var newSelectorModal = useModalReducer();
    var removeSelectorModal = useModalReducer();

    var newAgeFrameModal = useModalReducer();
    var editAgeFrameModal = useModalReducer();
    var removeAgeFrameModal = useModalReducer();

    var hooks = {
        newSelectorModal,
        removeSelectorModal,

        newAgeFrameModal,
        editAgeFrameModal,
        removeAgeFrameModal,
    }

    var callbacks = {
        onAddSelector: newSelectorModal.handleShow,
        onRemoveSelector: removeSelectorModal.handleShow,

        onAddAgeFrame: newAgeFrameModal.handleShow,
        onEditAgeFrame: editAgeFrameModal.handleShow,
        onRemoveAgeFrame: removeAgeFrameModal.handleShow,
    }

    return [ hooks, callbacks ];
}

export default SubjectTypeSettings;
