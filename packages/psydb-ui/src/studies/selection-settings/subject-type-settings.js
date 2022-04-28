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

    var newSelectorModal = useModalReducer();
    var removeSelectorModal = useModalReducer();

    var newAgeFrameModal = useModalReducer();
    var editAgeFrameModal = useModalReducer();
    var removeAgeFrameModal = useModalReducer();

    var [ didFetch, fetched ] = useFetchAll((agent) => {
        var promises = {
            crts: agent.readCustomRecordTypeMetadata(),
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

    var existingSubjectTypes = (
        selectorRecords.map(it => it.subjectTypeKey)
    );
    var hasNoTypesLeft = (
        Object.keys(subjectTypeMap).length === existingSubjectTypes.length
    );

    var canWrite = permissions.hasFlag('canWriteStudies');

    return (
        <div>
            
            <NewSelectorModal { ...({
                ...newSelectorModal.passthrough,
                studyId,
                subjectTypeMap,
                existingSubjectTypes,
                
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

                disableAddSelector: hasNoTypesLeft,

                ...(canWrite && {
                    onAddSelector: newSelectorModal.handleShow,
                    onRemoveSelector: removeSelectorModal.handleShow,

                    onAddAgeFrame: newAgeFrameModal.handleShow,
                    onEditAgeFrame: editAgeFrameModal.handleShow,
                    onRemoveAgeFrame: removeAgeFrameModal.handleShow,
                })
            })} />

        </div>
    )
}

export default SubjectTypeSettings;
