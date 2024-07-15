import React, { useState } from 'react';
import { jsonpointer, keyBy } from '@mpieva/psydb-core-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useFetch, useFetchAll } from '@mpieva/psydb-ui-hooks';
import { Button } from '@mpieva/psydb-ui-layout';

import {
    DefaultForm,
    Fields,
} from '../../formik';

import { FormFields } from './form-fields';

export const Component = (ps) => {
    var {
        enableSubjectId,
        subjectTypes,
        enableStudyId,
        studyTypes,

        enableTeamSelect,

        initialValues,
        onSubmit,
    } = ps;

    var translate = useUITranslation();

    var renderedForm = (
        <DefaultForm
            useAjvAsync
            ajvErrorInstancePathPrefix='/payload'
            initialValues={ initialValues }
            onSubmit={ onSubmit }
        >
            {(formikProps) => (
                <>
                    { /*console.log(formikProps.values) || ''*/ }
                    <FormFields { ...({
                        enableSubjectId,
                        subjectTypes,
                        enableStudyId,
                        studyTypes,
                        enableTeamSelect,
                    }) } />
                    <Button type='submit'>
                        { translate('Save') }
                    </Button>
                </>
            )}
        </DefaultForm>
    );

    return renderedForm;
}

