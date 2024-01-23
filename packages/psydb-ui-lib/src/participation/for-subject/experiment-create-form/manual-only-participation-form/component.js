import React from 'react';
import { Button } from '@mpieva/psydb-ui-layout';

import { DefaultForm } from '../../../../formik';
import * as Fields from '../form-fields/fields';

import {
    withSubjectTypeSelect,
    Footer,

    SubjectsAreTestedTogetherField,
    SplitExpSubjectFields,
    GroupExpSubjectFields
} from '../shared';

export const Component = withSubjectTypeSelect((ps) => {
    var {
        labMethodSettings,
        subjectType,
        related,
        
        studyId,
        enableTeamSelect,
        ...pass
    } = ps;

    var formBodyBag = {
        studyId,
        labMethodSettings,
        subjectType,
        related,
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
        studyId,
        labMethodSettings,
        subjectType,
        subjectCRT,
        related
    } = ps;

    var { values } = formik;
    var { subjectsAreTestedTogether } = values['$'];

    return (
        <>
            <SubjectsAreTestedTogetherField />

            { subjectsAreTestedTogether ? (
                <>
                    <GroupExpSubjectFields
                        label='Proband:innen'
                        dataXPath='$.subjectData'
                        subjectType={ subjectType }
                        enableMove={ false }
                    />
                    <Fields.Timestamp />
                </>
            ) : (
                <SplitExpSubjectFields
                    label='Proband:innen'
                    dataXPath='$.subjectData'
                    subjectType={ subjectType }
                    enableMove={ false }
                />
            )}
            
            <Fields.ApestudiesWKPRCDefaultLocation
                labMethodSettings={ labMethodSettings }
                related={ related }
            />
            <Fields.Team studyId={ studyId } />
        </>
    );
}
