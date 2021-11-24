import React from 'react';

import {
    Route,
    Switch,
    Redirect,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import {
    useFetchAll,
    useRevision,
    useModalReducer,
    usePermissions,
} from '@mpieva/psydb-ui-hooks';

import {
    LoadingIndicator
} from '@mpieva/psydb-ui-layout';

import {
    NewVariantModal,
    RemoveVariantModal,

    NewSettingModal,
    EditSettingModal,
    RemoveSettingModal,
} from './modals';

import VariantList from './variant-list';

const ExperimentSettings = ({
    studyType,
}) => {
    var { path, url } = useRouteMatch();
    var { id: studyId } = useParams();
    
    var { value: revision, up: increaseRevision } = useRevision();
    var permissions = usePermissions();
    
    var newVariantModal = useModalReducer();
    var removeVariantModal = useModalReducer();
    
    var newSettingModal = useModalReducer();
    var editSettingModal = useModalReducer();
    var removeSettingModal = useModalReducer();

    var [ didFetch, fetched ] = useFetchAll((agent) => {
        var promises = {
            crts: agent.readCustomRecordTypeMetadata(),
            study: agent.readRecord({
                collection: 'study',
                recordType: studyType,
                id: studyId
            }),
            variants: agent.fetchExperimentVariants({
                studyId,
            }),
            settings: agent.fetchExperimentVariantSettings({
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
    var variantRecords = fetched.variants.data.records;
    var {
        records: settingRecords,
        ...settingRelated
    } = fetched.settings.data;

    var allowedSubjectTypes = (
        customRecordTypes
        .filter(it => it.collection === 'subject')
        .reduce((acc, it) => ({
            ...acc,
            [it.type]: it.state.label
        }), {})
    );

    var canWrite = permissions.hasFlag('canWriteStudies');

    return (
        <div className='mt-3 mb-3'>

            <NewVariantModal { ...({
                ...newVariantModal.passthrough,
                studyId,
                onSuccessfulUpdate: increaseRevision
            })} />

            <RemoveVariantModal { ...({
                ...removeVariantModal.passthrough,
                onSuccessfulUpdate: increaseRevision
            })} />

            <NewSettingModal { ...({
                ...newSettingModal.passthrough,
                studyId,
                allowedSubjectTypes,
                onSuccessfulUpdate: increaseRevision
            })} />

            <EditSettingModal { ...({
                ...editSettingModal.passthrough,
                studyId,
                allowedSubjectTypes,
                onSuccessfulUpdate: increaseRevision
            })} />

            <RemoveSettingModal { ...({
                ...removeSettingModal.passthrough,
                onSuccessfulUpdate: increaseRevision
            })} />

            <VariantList { ...({
                variantRecords,
                settingRecords,
                settingRelated,
                customRecordTypes,
                ...(canWrite && {
                    onAddVariant: newVariantModal.handleShow,
                    onRemoveVariant: removeVariantModal.handleShow,

                    onAddSetting: newSettingModal.handleShow,
                    onEditSetting: editSettingModal.handleShow,
                    onRemoveSetting: removeSettingModal.handleShow,
                })
            })} />
            
        </div>
    )
}

export default ExperimentSettings;
