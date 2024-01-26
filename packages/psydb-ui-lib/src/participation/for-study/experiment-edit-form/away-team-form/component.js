import React from 'react';
import { only } from '@mpieva/psydb-core-utils';
import { useFetchAll } from '@mpieva/psydb-ui-hooks';
import {
    LoadingIndicator,
    FormHelpers,
    Alert,
    PaddedText
} from '@mpieva/psydb-ui-layout';

import { DefaultForm } from '../../../../formik';
import * as Fields from '../../form-fields';

import {
    withSubjectTypeSelect,
    Footer
} from '../shared';

import PerSubjectFields from './per-subject-fields';

export const Component = (ps) => {
    var {
        experiment,
        study,
        labMethodSettings,
        related,

        ...pass
    } = ps;

    var {
        didFetch,
        locationFieldDef,
    } = fromHooks(ps);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var initialValues = {
        ...only({ from: experiment.state, paths: [
            'locationId',
            'interval'
        ]}),
        subjectData: experiment.state.subjectData.map(it => ({
            subjectId: it.subjectId,
            status: it.participationStatus
        })),
        labOperatorIds: experiment.state.experimentOperatorIds,
    } // TODO: merge defaults?

    // NOTE: this should move into lab method settings
    var { enableFollowUpExperiments } = study.state;

    var formBodyBag = {
        study,
        labMethodSettings,
        related,

        enableFollowUpExperiments,
        locationFieldDef
    }

    return (
        <DefaultForm initialValues={ initialValues } { ...pass }>
            {(formikProps) => (
                <>
                    <FormBody { ...formBodyBag } formik={ formikProps } />
                    <Footer />
                </>
            )}
        </DefaultForm>
    );
}

const FormBody = (ps) => {
    var {
        formik,
        study,
        labMethodSettings,
        related,

        enableFollowUpExperiments,
        locationFieldDef
    } = ps;

    var { values } = formik;
    var { locationId } = values['$'];

    var subjectFieldsBag = {
        label: 'Proband:innen',
        dataXPath: '$.subjectData',
        enableFollowUpExperiments,
        enableMove: false,
        locationFieldDef,
        locationId,
    }

    return (
        <>
            <FormHelpers.InlineWrapper label={ locationFieldDef.displayName }>
                <PaddedText>
                    <b>{ related.records.location[locationId]._recordLabel }</b>
                </PaddedText>
            </FormHelpers.InlineWrapper>

            <PerSubjectFields { ...subjectFieldsBag } />
            <Fields.Interval />
            <Fields.ExperimentOperators />
        </>
    );
}

var fromHooks = (ps) => {
    var { labMethodSettings, study } = ps;
    var {
        subjectTypeKey: subjectType,
        subjectLocationFieldPointer
    } = labMethodSettings.state;

    var [ didFetch, fetched ] = useFetchAll((agent) => ({
        crtSettings: agent.readCRTSettings({
            collection: 'subject', recordType: subjectType
        }),
    }), [ subjectType ]);

    if (!didFetch) {
        return { didFetch };
    }

    var crtSettings = fetched.crtSettings.data;
    var locationFieldDef = (
        crtSettings.fieldDefinitions.scientific.find(it => (
            it.pointer === subjectLocationFieldPointer
        ))
    );
    
    return { didFetch, locationFieldDef };
}
