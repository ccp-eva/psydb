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
import { without } from '@mpieva/psydb-core-utils';
import { demuxed } from '@mpieva/psydb-ui-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';

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
    
    var translate = useUITranslation();
    var revision = useRevision();
    var permissions = usePermissions();
    
    var newVariantModal = useModalReducer();
    var removeVariantModal = useModalReducer();
    
    var newSettingModal = useModalReducer();
    var editSettingModal = useModalReducer();
    var removeSettingModal = useModalReducer();

    var [ didFetch, fetched ] = useFetchAll((agent) => {
        var promises = {
            allCRTs: agent.readCustomRecordTypeMetadata({
                ignoreResearchGroups: true
            }),
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
    }, [ studyId, revision.value ])

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { customRecordTypes } = fetched.crts.data;
    var { customRecordTypes: allCustomRecordTypes } = fetched.allCRTs.data;

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
            ...acc, [it.type]: translate.crt(it)
        }), {})
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
        onSuccessfulUpdate: demuxed([ onSuccessfulUpdate, revision.up ])
    }

    return (
        <div className='mt-3 mb-3'>

            <NewVariantModal { ...({
                ...newVariantModal.passthrough,
                ...modalBag,
                allowedLabOpsTypes,
            })} />

            <RemoveVariantModal { ...({
                ...removeVariantModal.passthrough,
                ...modalBag,
            })} />

            <NewSettingModal { ...({
                ...newSettingModal.passthrough,
                ...modalBag,
                allowedSubjectTypes,
            })} />

            <EditSettingModal { ...({
                ...editSettingModal.passthrough,
                ...modalBag,
                allowedSubjectTypes,
            })} />

            <RemoveSettingModal { ...({
                ...removeSettingModal.passthrough,
                ...modalBag,
            })} />

            <VariantList { ...({
                variantRecords,
                settingRecords,
                settingRelated,
                allCustomRecordTypes,
                customRecordTypes,
                
                allowedSubjectTypes: Object.keys(allowedSubjectTypes),
                disableAddLabOps: allowedLabOpsTypes.length < 1,

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
