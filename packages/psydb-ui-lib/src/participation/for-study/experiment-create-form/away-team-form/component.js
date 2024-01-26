import React from 'react';
import { only } from '@mpieva/psydb-core-utils';
import { useUILanguage, useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useFetchAll } from '@mpieva/psydb-ui-hooks';
import { LoadingIndicator, Alert } from '@mpieva/psydb-ui-layout';

import { DefaultForm } from '../../../../formik';
import * as Fields from '../../form-fields';

import {
    MultiSubjectHint,
    withSubjectTypeSelect,
    Footer
} from '../shared';

import PerSubjectFields from './per-subject-fields';

export const Component = withSubjectTypeSelect((ps) => {
    var { isTransmitting } = ps;

    var formBag = only({ from: ps, keys: [
        'useAjvAsync',
        'ajvErrorInstancePathPrefix',
        'onSubmit',
        'initialValues',
    ]});

    var {
        didFetch,
        locationFieldDef,
        enableFollowUpExperiments,
    } = fromHooks(ps);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var formBodyBag = {
        ...only({ from: ps, keys: [
            'labMethodSettings',
            'subjectType',
            'related',
            
            'studyId',
            'preselectedSubjectId',
            'preselectedSubject',
            'subjectsAreTestedTogetherOverride',
            'enableTeamSelect'
        ]}),

        locationFieldDef,
        enableFollowUpExperiments,
    }

    return (
        <DefaultForm { ...formBag }>
            {(formikProps) => (
                <>
                    <FormBody { ...formBodyBag } formik={ formikProps } />
                </>
            )}
        </DefaultForm>
    );
})

const FormBody = (ps) => {
    var {
        formik,
        labMethodSettings,
        subjectType,
        related,

        studyId,
        preselectedSubject,
        enableTeamSelect,
        enableFollowUpExperiments,
        locationFieldDef,
    } = ps;

    var { values } = formik;
    var { locationId } = values['$'];

    var translate = useUITranslation();
    var locationFieldLabel = translate.fieldDefinition(locationFieldDef);

    if (preselectedSubject && !locationId) {
        return (
            <Alert variant='danger'><b>
                { translate('Subject has Field "${field}" not set!', {
                    field: locationFieldLabel
                }) }
            </b></Alert>
        )
    }

    var subjectFieldsBag = {
        label: translate('Subjects'),
        dataXPath: '$.subjectData',
        
        subjectType,
        enableFollowUpExperiments,
        locationFieldDef,
        locationId,
        
        enableMove: false,
        fixedIndexes: preselectedSubject ? [ 0 ] : [],
    }

    return (
        <>
            <Fields.ForeignId
                label={ locationFieldLabel }
                dataXPath='$.locationId'
                collection={ locationFieldDef.props.collection }
                recordType={ locationFieldDef.props.recordType }
                readOnly={ !!preselectedSubject }
            />
            { locationId ? (
                <>
                    <PerSubjectFields { ...subjectFieldsBag } />
                    <Fields.Timestamp />
                    { 
                        enableTeamSelect
                        ? <Fields.Team studyId={ studyId } />
                        : <Fields.ExperimentOperators />
                    }
                </>
            ) : (
                <Alert variant='info'>
                    { translate('Please select ${that}.', {
                        that: locationFieldLabel
                    }) }
                </Alert>
            )}

            <Footer />
        </>
    );
}

var fromHooks = (ps) => {
    var { labMethodSettings, subjectType, studyId } = ps;
    var { subjectLocationFieldPointer } = labMethodSettings.state;

    var [ didFetch, fetched ] = useFetchAll((agent) => ({
        crtSettings: agent.readCRTSettings({
            collection: 'subject', recordType: subjectType
        }),
        study: agent.readRecord({
            collection: 'study',
            id: studyId
        })
    }), [ subjectType, studyId ]);

    if (!didFetch) {
        return { didFetch };
    }

    var { crtSettings, study } = fetched._stageDatas;

    var locationFieldDef = (
        crtSettings.fieldDefinitions.scientific.find(it => (
            it.pointer === subjectLocationFieldPointer
        ))
    );
    
    var { enableFollowUpExperiments } = study.record.state;

    return { didFetch, locationFieldDef, enableFollowUpExperiments };
}
