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
} from '@mpieva/psydb-ui-hooks';

import {
    Button,
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

const getAllowedSubjectTypes = (studyData) => {
    var { selectionSettingsBySubjectType } = studyData.record.state;
    var {
        subject: subjectTypeLabels
    } = studyData.relatedCustomRecordTypeLabels;

    var allowedSubjectTypes = (
        selectionSettingsBySubjectType.reduce(
            (acc, it) => ({
                ...acc,
                [it.subjectRecordType]: (
                    subjectTypeLabels[it.subjectRecordType].state.label
                )
            }), {}
        )
    );

    return allowedSubjectTypes;
}

const ExperimentSettings = ({
    studyType,
}) => {
    var { path, url } = useRouteMatch();
    var { id: studyId } = useParams();
    
    var { value: revision, up: increaseRevision } = useRevision();
    
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
        return (
            <LoadingIndicator size='lg' />
        );
    }

    var { customRecordTypes } = fetched.crts.data;
    var studyData = fetched.study.data;
    var variantRecords = fetched.variants.data.records;
    var {
        records: settingRecords,
        ...settingRelated
    } = fetched.settings.data;

    var allowedSubjectTypes = getAllowedSubjectTypes(studyData);

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

            <div className='mb-3'>
                <VariantList { ...({
                    variantRecords,
                    settingRecords,
                    settingRelated,
                    customRecordTypes,

                    onRemoveVariant: removeVariantModal.handleShow,

                    onAddSetting: newSettingModal.handleShow,
                    onEditSetting: editSettingModal.handleShow,
                    onRemoveSetting: removeSettingModal.handleShow,
                })} />
            </div>
            
            <Button
                size='sm'
                onClick={ () => newVariantModal.handleShow() }
            >
                + Neuer Ablauf
            </Button>
    
        </div>
    )
}

export default ExperimentSettings;
