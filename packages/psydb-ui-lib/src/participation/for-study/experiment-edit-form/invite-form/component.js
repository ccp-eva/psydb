import React from 'react';
import { only, unique } from '@mpieva/psydb-core-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
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
        experiment,
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
        experiment,
        labMethodSettings,
        subjectType,
        related,

        studyId,
        enableTeamSelect,
        enableFollowUpExperiments,
    } = ps;

    var translate = useUITranslation();

    var subjectFieldsBag = {
        label: translate('Subjects'),
        dataXPath: '$.subjectData',
        subjectType,
        enableFollowUpExperiments,
        enableMove: false,
    }

    var locationItems = unique({
        from: [
            ...labMethodSettings.state.locations,
            {
                locationId: experiment.state.locationId,
                customRecordTypeKey: experiment.state.locationRecordType
            }
        ],
        transformOption: it => it.locationId
    });

    return (
        <>
            <PerSubjectFields { ...subjectFieldsBag } />
            <Fields.Interval />
            <Fields.ExperimentOperators />
            <Fields.InviteLocation
                locationItems={ locationItems }
                related={ related }
            />
        </>
    );
}
