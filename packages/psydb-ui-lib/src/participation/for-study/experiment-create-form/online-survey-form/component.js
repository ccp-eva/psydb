import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useFetch } from '@mpieva/psydb-ui-hooks';
import { LoadingIndicator, SplitPartitioned } from '@mpieva/psydb-ui-layout';

import { DefaultForm } from '../../../../formik';
import * as Fields from '../form-fields/fields';

import {
    withSubjectTypeSelect,
    MultiSubjectHint,
    Footer
} from '../shared';

import PerSubjectFields from './per-subject-fields';

export const Component = withSubjectTypeSelect((ps) => {
    var {
        labMethodSettings,
        subjectType,
        related,

        studyId,
        enableTeamSelect = false,
        preselectedSubjectId = undefined,
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
        subjectType,
        enableFollowUpExperiments,
        preselectedSubjectId,
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
        subjectType,
        enableFollowUpExperiments,
        preselectedSubjectId = undefined,
    } = ps;
    

    var { values } = formik;
    var { subjectsAreTestedTogether } = values['$'];

    var translate = useUITranslation();

    return (
        <>
            { !preselectedSubjectId && (
                <SplitPartitioned partitions={[3,9]}>
                    <div />
                    <MultiSubjectHint isGrouped={
                        subjectsAreTestedTogether
                    } />
                </SplitPartitioned>
            )}
            <PerSubjectFields
                label={ translate('Subjects') }
                dataXPath='$.subjectData'
                subjectType={ subjectType }
                enableMove={ false }
                enableAdd={ !preselectedSubjectId }
                enableRemove={ !preselectedSubjectId }
                enableFollowUpExperiments={ enableFollowUpExperiments }
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
