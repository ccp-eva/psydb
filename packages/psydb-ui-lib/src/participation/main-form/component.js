import React from 'react';
import { Button } from '@mpieva/psydb-ui-layout';
import * as enums from '@mpieva/psydb-schema-enums';

import {
    DefaultForm,
    Fields,
} from '../../formik';

export const Component = (ps) => {
    var {
        enableSubjectId,
        subjectType,
        enableStudyId,
        studyType,

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
                        subjectType,
                        enableStudyId,
                        studyType
                    }) } />
                    <Button type='submit'>Speichern</Button>
                </>
            )}
        </DefaultForm>
    );

    return renderedForm;
}

const FormFields = (ps) => {
    var {
        enableSubjectId,
        subjectType,
        enableStudyId,
        studyType
    } = ps;

    return (
        <>
            <Fields.DateTime
                label='Test-Zeitpunkt'
                dataXPath='$.timestamp'
            />
            { enableStudyId && (
                <Fields.ForeignId
                    label='Studie'
                    dataXPath='$.studyId'
                    collection='study'
                    recordType={ studyType }
                />
            )}
            { enableSubjectId && (
                <Fields.ForeignId
                    label='Proband'
                    dataXPath='$.subjectId'
                    collection='subject'
                    recordType={ subjectType }
                />
            )}
            <Fields.GenericEnum
                label='Status'
                dataXPath='$.status'
                options={{
                    ...enums.inviteParticipationStatus.mapping,
                    ...enums.inviteUnparticipationStatus.mapping,
                }}
            />
        </>
    );
}
