import React from 'react';
import { only } from '@mpieva/psydb-core-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';

import { DefaultForm } from '../../../../formik';
import * as Fields from '../../form-fields';

import {
    withSubjectTypeSelect,
    Footer,

    SubjectsAreTestedTogetherField,
    SplitExpSubjectFields,
    GroupExpSubjectFields
} from '../shared';

export const Component = withSubjectTypeSelect((ps) => {
    var { isTransmitting } = ps;
    
    var formBag = only({ from: ps, keys: [
        'useAjvAsync',
        'ajvErrorInstancePathPrefix',
        'onSubmit',
        'initialValues',
    ]});

    var formBodyBag = only({ from: ps, keys: [
        'labMethodSettings',
        'subjectType',
        'related',
        
        'studyId',
        'preselectedSubjectId',
        'preselectedSubject',
        'subjectsAreTestedTogetherOverride',
    ]});

    return (
        <DefaultForm { ...formBag }>
            {(formikProps) => (
                <>
                    <FormBody { ...formBodyBag } formik={ formikProps } />
                    <Footer isTransmitting={ isTransmitting } />
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
        related,
        subjectsAreTestedTogetherOverride = undefined,
    } = ps;

    var branchingValues = only({ from: formik.values['$'], keys: [
        'subjectsAreTestedTogether'
    ]});

    return (
        <>
            { subjectsAreTestedTogetherOverride === undefined && (
                <SubjectsAreTestedTogetherField />
            )}

            <BranchFields { ...ps } { ...branchingValues } />
            
            <Fields.ApestudiesWKPRCDefaultLocation
                labMethodSettings={ labMethodSettings }
                related={ related }
            />
            <Fields.Team studyId={ studyId } />
        </>
    );
}

// XXX: do fieldsites have group experiments?
var BranchFields = (ps) => {
    var {
        preselectedSubjectId = undefined,
        subjectsAreTestedTogether,

        subjectType
    } = ps;

    var translate = useUITranslation();

    if (preselectedSubjectId) {
        return (
            <>
                <Fields.ForeignId
                    label={ translate('Subject') }
                    dataXPath='$.subjectData.0.subjectId'
                    collection='subject'
                    recordType={ subjectType }
                    readOnly={ true }
                />
                <Fields.Timestamp />
            </>
        )
    }
    else if (subjectsAreTestedTogether) {
        return (
            <>
                <GroupExpSubjectFields
                    label={ translate('Subjects') }
                    { ...getMultiSubjectsBag(ps) }
                />
                <Fields.Timestamp />
            </>
        )
    }
    else {
        return (
            <SplitExpSubjectFields 
                label={ translate('Subject') }
                { ...getMultiSubjectsBag(ps) }
            />
        )
    }

}

var getMultiSubjectsBag = (ps) => {
    var { subjectType, preselectedSubjectId } = ps;
    return {
        dataXPath: '$.subjectData',
        subjectType,
        enableMove: false,
        fixedIndexes: preselectedSubjectId ? [ 0 ] : [],
        required: true
    }
}
