import React from 'react';
import { only } from '@mpieva/psydb-core-utils';
import { useFetch } from '@mpieva/psydb-ui-hooks';
import { LoadingIndicator, SplitPartitioned } from '@mpieva/psydb-ui-layout';

import { DefaultForm } from '../../../../formik';
import * as Fields from '../form-fields/fields';

import {
    withSubjectTypeSelect,
    Footer
} from '../shared';

import PerSubjectFields from './per-subject-fields';

export const Component = (ps) => {
    var {
        subjectType,
        experiment,
        study,
        labMethodSettings,
        related,
        
        ...pass
    } = ps;
    
    var initialValues = {
        ...only({ from: experiment.state, paths: [
            'interval'
        ]}),
        subjectData: [ experiment.state.subjectData[0] ]
    }

    // NOTE: this should move into lab method settings
    var { enableFollowUpExperiments } = study.state;

    var formBodyBag = {
        subjectType,
        enableFollowUpExperiments
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
        subjectType,
        enableFollowUpExperiments
    } = ps;

    var { values } = formik;

    return (
        <>
            <Fields.ForeignId
                label='Proband:in'
                dataXPath={`$.subjectData.0.subjectId`}
                collection='subject'
                recordType={ subjectType }
            />
            <Fields.IntervalStartOnly />
            
            <Fields.Status type='online-survey'
                dataXPath={`$.subjectData.0.participationStatus`}
            />
            { enableFollowUpExperiments && (
                <Fields.DefaultBool
                    dataXPath='$.subjectData.0.excludeFromMoreExperimentsInStudy'
                    label='Ist letzte Umfrage'
                />
            )}
        </>
    );
}
