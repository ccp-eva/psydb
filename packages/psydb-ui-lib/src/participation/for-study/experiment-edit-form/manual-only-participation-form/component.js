import React from 'react';
import { only } from '@mpieva/psydb-core-utils';

import { DefaultForm } from '../../../../formik';
import * as Fields from '../../form-fields';

import {
    GroupExpSubjectFields,
    Footer,
} from '../shared';

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
        ]}),
        timestamp: experiment.state.interval.start,
        subjectData: experiment.state.subjectData.map(it => ({
            subjectId: it.subjectId,
            status: it.participationStatus
        })),
        labOperatorIds: experiment.state.experimentOperatorIds,
    }

    var formBodyBag = {
        labMethodSettings,
        subjectType,
        related,
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
        subjectCRT,
        related
    } = ps;

    var { values } = formik;

    return (
        <>
            <GroupExpSubjectFields
                label='Proband:innen'
                dataXPath='$.subjectData'
                subjectType={ subjectType }
                enableMove={ false }
            />
            <Fields.Timestamp />
            
            <Fields.ApestudiesWKPRCDefaultLocation
                labMethodSettings={ labMethodSettings }
                related={ related }
            />
            <Fields.ExperimentOperators />
        </>
    );
}
