import React from 'react';
import { InputGroup, Form } from '@mpieva/psydb-ui-layout';
import { withField } from '@cdxoo/formik-utils';

const PartField = withField({
    type: 'number',
    fakeDefault: Infinity,
    Control: (ps) => {
        var { isInvalid, formikField, disabled, min = 0, max, step = 1 } = ps;
        return (
            <Form.Control { ...({
                type: 'number', disabled, min, max, step,
                isInvalid,
                ...formikField
            })} />
        )
    },
    DefaultWrapper: 'NoneWrapper'
})

export const AgeFrameBoundary = withField({ Control: (ps) => {
    var {
        dataXPath,
        formikField,
        formikForm,
        formikMeta,
        disabled,
    } = ps;

    var { error } = formikMeta;

    return (
        <InputGroup>
            <PartField
                dataXPath={`${dataXPath}.years`}
                disabled={ disabled }
                isInvalid={ !!error }
            />
            <PartField
                dataXPath={`${dataXPath}.months`}
                disabled={ disabled }
                max={ 12 }
                isInvalid={ !!error }
            />
            <PartField
                dataXPath={`${dataXPath}.days`}
                disabled={ disabled }
                isInvalid={ !!error }
                max={ 30 }
            />
            <InputGroup.Append>
                <InputGroup.Text>J/M/T</InputGroup.Text>
            </InputGroup.Append>
        </InputGroup>
    )
}});
