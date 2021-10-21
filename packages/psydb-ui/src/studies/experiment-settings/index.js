import React from 'react';
import { useFetchAll, useRevision } from '@mpieva/psydb-ui-hooks';

import {
    Route,
    Switch,
    Redirect,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import { useModalReducer } from '@mpieva/psydb-ui-hooks';
import {
    Button,
    LoadingIndicator
} from '@mpieva/psydb-ui-layout';

import NewVariantModal from './new-variant-modal';
import NewSettingModal from './new-setting-modal';
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
    
    var [ revision, increaseRevision ] = useRevision();
    var newVariantModal = useModalReducer();
    var newSettingModal = useModalReducer();

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
    var { settingRecords ...settingRelated } = fetched.settings.data;

    var subjectTypeLabels = (
        customRecordTypes
        .filter(it => it.collection === 'subject')
        .reduce((acc, it) => ({
            ...acc,
            [it.type]: it.state.label
        }), {})
    );

    var allowedSubjectTypes = getAllowedSubjectTypes(studyData);

    return (
        <div className='mt-3 mb-3'>

            <NewVariantModal { ...({
                ...newVariantModal.passthrough,
                studyId,
                onSuccessfulUpdate: increaseRevision
            })} />

            <NewSettingModal { ...({
                ...newSettingModal.passthrough,
                studyId,
                allowedSubjectTypes,
                onSuccessfulUpdate: increaseRevision
            })} />

            <div className='mb-3'>
                <VariantList { ...({
                    variantRecords,
                    settingRecords,
                    settingRelated,
                    subjectTypeLabels,

                    onAddSetting: newSettingModal.handleShow
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
