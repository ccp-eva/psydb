import React from 'react';
import { only } from '@mpieva/psydb-core-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';

import { DefaultForm } from '../../../../formik';
import * as Fields from '../../form-fields';

import {
    withSubjectTypeSelect,
    Footer
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
    
    var initialValues = createInitialValues(ps);

    // NOTE: this should move into lab method settings
    var { enableFollowUpExperiments } = study.state;

    var formBag = only({ from: ps, keys: [
        'useAjvAsync',
        'ajvErrorInstancePathPrefix',
        'onSubmit'
    ]});

    var formBodyBag = {
        subjectType,
        enableFollowUpExperiments
    }

    var footerBag = only({ from: ps, keys: [
        'isTransmitting',
        'enableSubmit'
    ]});

    return (
        <DefaultForm { ...formBag } initialValues={ initialValues }>
            {(formikProps) => (
                <>
                    <FormBody { ...formBodyBag } formik={ formikProps } />
                    <Footer { ...footerBag } />
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

    var translate = useUITranslation();

    return (
        <>
            <Fields.ForeignId
                label={ translate('Subject') }
                dataXPath={`$.subjectData.0.subjectId`}
                collection='subject'
                recordType={ subjectType }
            />
            <Fields.Timestamp />
            
            <Fields.Status type='online-survey'
                dataXPath={`$.subjectData.0.status`}
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

const createInitialValues = (ps) => {
    var { experiment } = ps;

    var initialValues = {
        timestamp: experiment.state.interval.start,
        subjectData: experiment.state.subjectData.map(it => ({
            subjectId: it.subjectId,
            status: it.participationStatus,
            excludeFromMoreExperimentsInStudy: (
                it.excludeFromMoreExperimentsInStudy || false
            )
        })),
    }

    return initialValues;
}
