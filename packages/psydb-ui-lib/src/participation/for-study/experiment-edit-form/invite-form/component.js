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
            'locationId',
            'interval'
        ]}),
        subjectData: experiment.state.subjectData.map(it => ({
            subjectId: it.subjectId,
            status: it.participationStatus,
            excludeFromMoreExperimentsInStudy: (
                it.excludeFromMoreExperimentsInStudy
            )
        })),
        labOperatorIds: experiment.state.experimentOperatorIds,
    }

    // NOTE: this should move into lab method settings
    var { enableFollowUpExperiments } = study.state;

    var formBodyBag = {
        subjectType,
        labMethodSettings,
        related,
        enableFollowUpExperiments,
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
        labMethodSettings,
        subjectType,
        related,

        studyId,
        enableTeamSelect,
        enableFollowUpExperiments,
    } = ps;

    var { values } = formik;
    
    var subjectFieldsBag = {
        label: 'Proband:innen',
        dataXPath: '$.subjectData',
        subjectType,
        enableFollowUpExperiments,
        enableMove: false,
    }

    return (
        <>
            <PerSubjectFields { ...subjectFieldsBag } />
            <Fields.Interval />
            <Fields.ExperimentOperators />
            <Fields.InviteLocation
                labMethodSettings={ labMethodSettings }
                related={ related }
            />
        </>
    );
}
