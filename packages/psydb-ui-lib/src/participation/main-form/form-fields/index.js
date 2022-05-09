import React from 'react';
import * as enums from '@mpieva/psydb-schema-enums';

import {
    DefaultForm,
    Fields,
    useFormikContext
} from '../../../formik';

import { LabProcedureFields } from './lab-procedure-fields';



export const FormFields = (ps) => {
    var {
        enableSubjectId,
        subjectTypes,
        enableStudyId,
        studyTypes,

        enableTeamSelect,
    } = ps;

    var { values } = useFormikContext();
    var {
        studyId,
        subjectId,
        studyType,
        subjectType,
        labProcedureType,
    } = values['$'];

    console.log(studyId);

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
                    label='Proband:in'
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

            <LabProcedureFields
                subjectType={ subjectType }
                subjectId={ subjectId }
                studyId={ studyId }
                enableTeamSelect={ enableTeamSelect }
            />
        </>
    );
}

