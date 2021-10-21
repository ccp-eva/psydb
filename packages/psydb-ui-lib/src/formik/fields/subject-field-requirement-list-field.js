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

const defaultItemValue = {
    pointer: null,
    check: null
};

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
    var values = getFieldProps(dataXPath).value || [];

    return (
        <FormHelpers.ObjectArrayContentWrapper { ...({
            formikArrayHelpers,
            defaultItemValue,
            itemsCount: values.length,
            disabled,
        })}>
            { values.map((value, index) => {
                return (
                    <FormHelpers.ObjectArrayItemWrapper
                        key={ index }
                        index={ index }
                        lastIndex={ values.length - 1 }
                        formikArrayHelpers={ formikArrayHelpers }
                        disabled={ disabled }
                    >
                        <SubjectFieldRequirementField { ...({
                            index,
                            dataXPath: `${dataXPath}[${index}]`,
                            formikArrayHelpers,
                            subjectScientificFields,
                            disabled,
                        })} />
                    </FormHelpers.ObjectArrayItemWrapper>
                );
            }) }
        </FormHelpers.ObjectArrayContentWrapper>
    )
}

export const SubjectFieldRequirementListField = WithField({
    Control,
    Wrapper: FormHelpers.InlineArrayWrapper
});
