import React, { useState } from 'react';
import jsonpointer from 'jsonpointer';

import { keyBy } from '@mpieva/psydb-core-utils';
import { useFetch, useFetchAll } from '@mpieva/psydb-ui-hooks';
import { Button } from '@mpieva/psydb-ui-layout';
import * as enums from '@mpieva/psydb-schema-enums';

import {
    DefaultForm,
    Fields,
} from '../../../formik';

import { LabProcedureFields } from './lab-procedure-fields';

export const FormFields = (ps) => {
    var {
        enableSubjectId,
        subjectTypes,
        enableStudyId,
        studyTypes,

        enableTeamSelect,
        formikForm,
    } = ps;

    var {
        studyId,
        subjectId,
        studyType,
        subjectType,
        labProcedureType,
    } = formikForm.values['$'];

    var showStudyTypeSelect = (
        enableStudyId && !(studyTypes.length === 1 && studyType)
    );
    var showSubjectTypeSelect = (
        enableSubjectId && !(subjectTypes.length === 1 && subjectType)
    );

    return (
        <>
            { showSubjectTypeSelect && (
                <Fields.GenericEnum
                    label='Probanden-Typ'
                    dataXPath='$.subjectType'
                    options={ subjectTypes.reduce((acc, it) => ({
                        ...acc, [it.type]: it.label
                    }), {}) }
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

            { showStudyTypeSelect && (
                <Fields.GenericEnum
                    label='Studien-Typ'
                    dataXPath='$.studyType'
                    options={ studyTypes.reduce((acc, it) => ({
                        ...acc, [it.type]: it.label
                    }), {}) }
                />
            )}
            { enableStudyId && (
                <Fields.ForeignId
                    label='Studie'
                    dataXPath='$.studyId'
                    collection='study'
                    recordType={ studyType }
                />
            )}

            <Fields.DateTime
                label='Test-Zeitpunkt'
                dataXPath='$.timestamp'
                disabled={ !subjectId }
            />
            <Fields.GenericEnum
                label='Status'
                dataXPath='$.status'
                options={{
                    ...enums.inviteParticipationStatus.mapping,
                    ...enums.inviteUnparticipationStatus.mapping,
                }}
                disabled={ !subjectId }
            />

            <LabProcedureFields
                subjectType={ subjectType }
                subjectId={ subjectId }
                studyId={ studyId }
                enableTeamSelect={ enableTeamSelect }

                formikForm={ formikForm }
            />
        </>
    );
}

