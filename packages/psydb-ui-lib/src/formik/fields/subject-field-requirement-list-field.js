import React from 'react';
import { FieldArray } from 'formik';
import { Form, FormHelpers } from '@mpieva/psydb-ui-layout';
import WithField from '../with-field';
import {
    SubjectFieldRequirementField
} from './subject-field-requirement-field';

const Control = (ps) => {
    var { dataXPath } = ps;
    return (
        <FieldArray name={ dataXPath }>
            {(helpers) => (
                <List { ...ps } formikArrayHelpers={ helpers } />
            )}
        </FieldArray>
    )
}

const List = (ps) => {
    var {
        dataXPath,
        formikField,
        formikMeta,
        formikForm,
        formikArrayHelpers,
        subjectScientificFields,
        disabled,
    } = ps;

    var {
        push
    } = formikArrayHelpers

    var { getFieldProps } = formikForm;
    var values = getFieldProps(dataXPath).value;

    return (
        <>
            { (values || []).map((value, index) => {
                return <SubjectFieldRequirementField key={ index } { ...({
                    index,
                    dataXPath: `${dataXPath}[${index}]`,
                    formikArrayHelpers,
                    subjectScientificFields,
                    disabled,
                })} />
            }) }
            <button type='button' onClick={ () => push('foo') }>Push</button>
        </>
    )
}

export const SubjectFieldRequirementListField = WithField({
    Control,
    Wrapper: FormHelpers.InlineArrayWrapper
});
