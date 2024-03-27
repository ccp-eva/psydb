import React from 'react';

import {
    Route,
    Switch,
    Redirect,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import * as enums from '@mpieva/psydb-schema-enums';
import { without, only } from '@mpieva/psydb-core-utils';

import { demuxed } from '@mpieva/psydb-ui-utils';
import { useUITranslation, useUILanguage } from '@mpieva/psydb-ui-contexts';

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

const ExperimentSettings = (ps) => {
    var {
        studyType,
        onSuccessfulUpdate
    } = ps;

    var { path, url } = useRouteMatch();
    var { id: studyId } = useParams();
    
    var language = useUILanguage();
    var translate = useUITranslation();
    var revision = useRevision();
    var permissions = usePermissions();
    
    var [ modalHooks, modalCallbacks ] = useAllModals();

    var [ didFetch, fetched ] = useFetchAll((agent) => {
        var promises = {
            allCRTs: agent.readCustomRecordTypeMetadata({
                ignoreResearchGroups: true
            }),
            crts: agent.readCustomRecordTypeMetadata(),
            availableSubjectCRTs: agent.fetchStudyAvailableSubjectCRTs({
                studyId,
            }),
            variants: agent.fetchExperimentVariants({ studyId }),
            settings: agent.fetchExperimentVariantSettings({ studyId }),
        }
        return promises;
    }, [ studyId, revision.value ])

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { customRecordTypes } = fetched.crts.data;
    var { customRecordTypes: allCustomRecordTypes } = fetched.allCRTs.data;

    var availableSubjectCRTs = fetched.availableSubjectCRTs.data.crts;

    var variantRecords = fetched.variants.data.records;
    var {
        records: settingRecords,
        ...settingRelated
    } = fetched.settings.data;

    var allowedSubjectTypes = (
        availableSubjectCRTs.asOptions({ language })
    );

    var allowedLabOpsTypes = without(
        enums.labMethods.keys.filter(it => (
            permissions.isLabMethodAvailable(it)
        )),
        variantRecords.map(it => it.type)
    );

    var canWrite = permissions.hasFlag('canWriteStudies');

    var modalBag = {
        studyId,
        onSuccessfulUpdate: demuxed([ onSuccessfulUpdate, revision.up ]),

        allowedLabOpsTypes,
        allowedSubjectTypes,
        availableSubjectCRTs,
    }
    
    return (
        <div className='mt-3 mb-3'>
            <AllModals
                { ...modalHooks }
                { ...modalBag }
            />

            <VariantList { ...({
                variantRecords,
                settingRecords,
                settingRelated,
                allCustomRecordTypes,
                customRecordTypes,
                availableSubjectCRTs,
                
                allowedSubjectTypes: Object.keys(allowedSubjectTypes),
                disableAddLabOps: allowedLabOpsTypes.length < 1,

                ...(canWrite && modalCallbacks)
            })} />
        </div>
    )
}

var AllModals = (ps) => {
    var {
        allowedLabOpsTypes,
        allowedSubjectTypes,
        availableSubjectCRTs,

        newVariantModal,
        removeVariantModal,
        
        newSettingModal,
        editSettingModal,
        removeSettingModal,
    } = ps;

    var pass = only({ from: ps, keys: [
        'studyId', 'onSuccessfulUpdate',
    ]});

    return (
        <>
            <NewVariantModal { ...({
                ...newVariantModal.passthrough,
                ...pass,
                allowedLabOpsTypes,
            })} />

            <RemoveVariantModal { ...({
                ...removeVariantModal.passthrough,
                ...pass,
            })} />

            <NewSettingModal { ...({
                ...newSettingModal.passthrough,
                ...pass,
                allowedSubjectTypes,
                availableSubjectCRTs,
            })} />

            <EditSettingModal { ...({
                ...editSettingModal.passthrough,
                ...pass,
                allowedSubjectTypes,
                availableSubjectCRTs,
            })} />

            <RemoveSettingModal { ...({
                ...removeSettingModal.passthrough,
                ...pass,
            })} />
        </>
    );
}

var useAllModals = (ps) => {
    var newVariantModal = useModalReducer();
    var removeVariantModal = useModalReducer();
    
    var newSettingModal = useModalReducer();
    var editSettingModal = useModalReducer();
    var removeSettingModal = useModalReducer();

    var hooks = {
        newVariantModal,
        removeVariantModal,
        
        newSettingModal,
        editSettingModal,
        removeSettingModal,
    }

    var callbacks = {
        onAddVariant: newVariantModal.handleShow,
        onRemoveVariant: removeVariantModal.handleShow,

        onAddSetting: newSettingModal.handleShow,
        onEditSetting: editSettingModal.handleShow,
        onRemoveSetting: removeSettingModal.handleShow,
    };

    return [ hooks, callbacks ]
}

export default ExperimentSettings;
