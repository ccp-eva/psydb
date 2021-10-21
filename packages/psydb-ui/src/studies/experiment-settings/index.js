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

import {
    DefaultForm,
    SaneStringField,
    GenericEnumField,
    IntegerField,
    ForeignIdField,
    SubjectFieldRequirementListField
} from '@mpieva/psydb-ui-lib/src/formik';

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

    var studyData = fetched.study.data;
    var variantRecords = fetched.variants.data.records;
    var settingRecords = fetched.settings.data.records;

    var allowedSubjectTypes = getAllowedSubjectTypes(studyData);

    return (
        <div className='mt-3 mb-3'>

            <DefaultForm onSubmit={(...args) => { console.log({ args })}}>
                {(formikProps) => {
                    var { getFieldProps } = formikProps;
                    return <div>
                        <SaneStringField label='Foo' dataXPath='$.foo' />
                        <SubjectFieldRequirementListField
                            label='Req'
                            dataXPath='$.req'
                            subjectScientificFields={[
                                { key: 'foo', displayName: 'Foo'}
                            ]}
                        />
                        <Button type='submit'>Submit</Button>
                    </div>
                }}
            </DefaultForm>

            <hr />

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
