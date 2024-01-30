import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useFetch } from '@mpieva/psydb-ui-hooks';
import { LoadingIndicator, SplitPartitioned } from '@mpieva/psydb-ui-layout';

import { DefaultForm } from '../../../../formik';
import * as Fields from '../../form-fields';

import {
    withSubjectTypeSelect,
    MultiSubjectHint,
    Footer
} from '../shared';

import PerSubjectFields from './per-subject-fields';

export const Component = (ps) => {
    var {
        labMethodSettings,
        subjectType,
        related,

        studyId,
        preselectedSubjectId = undefined,
        enableTeamSelect = false,
        ...pass
    } = ps;


    var {
        didFetch,
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
        preselectedSubjectId,
        enableTeamSelect,
        enableFollowUpExperiments,
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
}

const FormBody = (ps) => {
    var {
        formik,
        labMethodSettings,
        subjectType,
        related,

        studyId,
        preselectedSubjectId = undefined,
        enableTeamSelect = false,
        enableFollowUpExperiments,
    } = ps;

    var { values } = formik;
    var { subjectsAreTestedTogether } = values['$'];
    
    var translate = useUITranslation();

    var subjectFieldsBag = {
        label: translate('Subjects'),
        dataXPath: '$.subjectData',
        subjectType,
        enableFollowUpExperiments,
        enableMove: false,
        fixedIndexes: preselectedSubjectId ? [ 0 ] : [],
    }

    return (
        <>
            { !preselectedSubjectId && (
                <SplitPartitioned partitions={[3,9]}>
                    <div />
                    <MultiSubjectHint isGrouped={ true } />
                </SplitPartitioned>
            )}
            <PerSubjectFields { ...subjectFieldsBag } />
            <Fields.Timestamp />
            { 
                enableTeamSelect
                ? <Fields.Team studyId={ studyId } />
                : <Fields.ExperimentOperators />
            }
            <Fields.InviteLocation
                locationItems={ labMethodSettings.state.locations }
                related={ related }
            />
        </>
    );
}

const fromHooks = (ps) => {
    var { studyId } = ps;

    var [ didFetch, fetched ] = useFetch((agent) => (
        studyId
        ? agent.readRecord({
            collection: 'study',
            id: studyId
        })
        : undefined
    ), [ studyId ]);

    if (!didFetch) {
        return { didFetch }
    }

    var { enableFollowUpExperiments } = fetched.data.record.state;
    return { didFetch, enableFollowUpExperiments }
}
