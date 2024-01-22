import React from 'react';
import { useFetch } from '@mpieva/psydb-ui-hooks';
import { LoadingIndicator, SplitPartitioned } from '@mpieva/psydb-ui-layout';

import { DefaultForm } from '../../../../formik';
import * as Fields from '../form-fields/fields';

import {
    withSubjectTypeSelect,
    Footer
} from '../shared';

import PerSubjectFields from './per-subject-fields';

export const Component = withSubjectTypeSelect((ps) => {
    var {
        labMethodSettings,
        subjectType,
        related,

        studyId,
        enableTeamSelect,
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
        enableFollowUpExperiments
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
        enableFollowUpExperiments
    } = ps;

    var { values } = formik;
    var { subjectsAreTestedTogether } = values['$'];

    return (
        <>
            <SplitPartitioned partitions={[3,9]}>
                <div />
                <div className='text-muted'><i>
                    <b>Hinweis:</b>
                    {' '}
                    die Auswal mehrerer Proand:innen wird wie mehrere,
                    unabhängige Einzeltermine hinterlegt
                </i></div>
            </SplitPartitioned>
            <PerSubjectFields
                label='Proband:innen'
                dataXPath='$.subjectData'
                subjectType={ subjectType }
                enableMove={ false }
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
