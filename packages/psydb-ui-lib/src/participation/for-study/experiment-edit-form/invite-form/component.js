import React from 'react';
import { only, unique } from '@mpieva/psydb-core-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';

import { DefaultForm } from '../../../../formik';
import * as Fields from '../../form-fields';

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

    var initialValues = createInitialValues(ps);

    // NOTE: this should move into lab method settings
    var { enableFollowUpExperiments } = study.state;

    var formBag = only({ from: ps, keys: [
        'useAjvAsync',
        'ajvErrorInstancePathPrefix',
        'onSubmit'
    ]});

    var formBodyBag = {
        ...only({ from: ps, keys: [
            'experiment',
            'subjectType',
            'labMethodSettings',
            'related',
        ]}),
        enableFollowUpExperiments,
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
        subjectType,
        related,
        enableTeamSelect,
        enableFollowUpExperiments,
    } = ps;

    var translate = useUITranslation();

    var subjectFieldsBag = {
        label: translate('Subjects'),
        dataXPath: '$.subjectData',
        enableMove: false,

        subjectType,
        enableFollowUpExperiments,
    }

    var locationItems = mergeLocationItems(ps)

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

const createInitialValues = (ps) => {
    var { experiment } = ps;

    var {
        locationId, interval, subjectData, experimentOperatorIds
    } = experiment.state;

    var initialValues = {
        locationId,
        interval,
        subjectData: subjectData.map(it => ({
            subjectId: it.subjectId,
            status: it.participationStatus,
            excludeFromMoreExperimentsInStudy: (
                it.excludeFromMoreExperimentsInStudy || false
            )
        })),
        labOperatorIds: experimentOperatorIds,
    }

    return initialValues;
}

const mergeLocationItems = (ps) => {
    var { experiment, labMethodSettings } = ps;
    
    var locationItems = unique({
        from: [
            ...(labMethodSettings?.state?.locations || []),
            {
                locationId: experiment.state.locationId,
                customRecordTypeKey: experiment.state.locationRecordType
            }
        ],
        transformOption: it => it.locationId
    });

    return locationItems;
}
