import React from 'react';
import { useFetchAll } from '@mpieva/psydb-ui-hooks';
import { LoadingIndicator, Alert } from '@mpieva/psydb-ui-layout';

import { DefaultForm } from '../../../../formik';
import * as Fields from '../form-fields/fields';

import {
    withSubjectTypeSelect,
    Footer
} from '../shared';

import PerSubjectFields from './per-subject-fields';

export const Component = withSubjectTypeSelect((ps) => {
    var {
        labMethodSettings,
        subjectType,
        related,

        studyId,
        enableTeamSelect,
        ...pass
    } = ps;

    var {
        didFetch,
        locationFieldDef,
        enableFollowUpExperiments,
    } = fromHooks(ps);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var formBodyBag = {
        labMethodSettings,
        subjectType,
        related,

        studyId,
        enableTeamSelect,
        enableFollowUpExperiments,
        locationFieldDef
    }

    return (
        <DefaultForm { ...pass }>
            {(formikProps) => (
                <>
                    <FormBody { ...formBodyBag } formik={ formikProps } />
                    <Footer />
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
        enableTeamSelect,
        enableFollowUpExperiments,
        locationFieldDef
    } = ps;

    var { values } = formik;
    var { locationId } = values['$'];

    var subjectFieldsBag = {
        label: 'Proband:innen',
        dataXPath: '$.subjectData',
        subjectType,
        enableFollowUpExperiments,
        enableMove: false,
        locationFieldDef,
        locationId,
    }

    return (
        <>
            <Fields.ForeignId
                label={ locationFieldDef.displayName }
                dataXPath='$.locationId'
                collection={ locationFieldDef.props.collection }
                recordType={ locationFieldDef.props.recordType }
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
                    Bitte zuerst { locationFieldDef.displayName } auswählen
                </Alert>
            )}
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

    var crtSettings = fetched.crtSettings.data;
    var locationFieldDef = (
        crtSettings.fieldDefinitions.scientific.find(it => (
            it.pointer === subjectLocationFieldPointer
        ))
    );
    
    var study = fetched.study.data;
    var { enableFollowUpExperiments } = study.record.state;

    return { didFetch, locationFieldDef, enableFollowUpExperiments };
}
