import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
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
        timestamp: experiment.state.interval.start,
        subjectData: experiment.state.subjectData.map(it => ({
            subjectId: it.subjectId,
            status: it.participationStatus,
            excludeFromMoreExperimentsInStudy: (
                it.excludeFromMoreExperimentsInStudy
            )
        })),
        labOperatorIds: experiment.state.experimentOperatorIds,
    } // TODO: merge defaults?

    // NOTE: this should move into lab method settings
    var { enableFollowUpExperiments } = study.state;

    var formBodyBag = {
        study,
        experiment,
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
        experiment,
        related,

        enableFollowUpExperiments,
        locationFieldDef
    } = ps;

    var translate = useUITranslation();

    var { locationId } = experiment.state;

    var subjectFieldsBag = {
        label: translate('Subjects'),
        dataXPath: '$.subjectData',
        enableFollowUpExperiments,
        enableMove: false,
        locationFieldDef,
        locationId,
    }

    return (
        <>
            <FormHelpers.InlineWrapper label={
                translate.fieldDefinition(locationFieldDef)
            }>
                <PaddedText>
                    <b>{ related.records.location[locationId]._recordLabel }</b>
                </PaddedText>
            </FormHelpers.InlineWrapper>

            <PerSubjectFields { ...subjectFieldsBag } />
            <Fields.Timestamp />
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
