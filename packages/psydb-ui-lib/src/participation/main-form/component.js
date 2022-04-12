import React, { useState } from 'react';
import jsonpointer from 'jsonpointer';

import { keyBy } from '@mpieva/psydb-core-utils';
import { useFetch, useFetchAll } from '@mpieva/psydb-ui-hooks';
import { Button } from '@mpieva/psydb-ui-layout';
import * as enums from '@mpieva/psydb-schema-enums';

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
                        formikForm: formikProps,
                    }) } />
                    <Button type='submit'>Speichern</Button>
                </>
            )}
        </DefaultForm>
    );

    return renderedForm;
}

