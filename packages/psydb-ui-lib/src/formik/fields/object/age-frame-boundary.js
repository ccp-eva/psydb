import React from 'react';
import { InputGroup, Form } from '@mpieva/psydb-ui-layout';
import WithField from '../../with-field';

const PartField = WithField({
    type: 'number',
    fakeDefault: Infinity,
    Control: (ps) => {
        var { formikField, disabled, min = 0, max, step = 1 } = ps;
        return (
            <Form.Control { ...({
                type: 'number', disabled, min, max, step,
                ...formikField
            })} />
        )
    },
    DefaultWrapper: ({ children }) => (<>{ children }</>)
})

export const AgeFrameBoundary = WithField({ Control: (ps) => {
    var {
        dataXPath,
        formikField,
        formikForm,
        disabled,
    } = ps;

    return (
        <InputGroup>
            <PartField
                dataXPath={`${dataXPath}.years`}
                disabled={ disabled }
            />
            <PartField
                dataXPath={`${dataXPath}.months`}
                disabled={ disabled }
                max={ 12 }
            />
            <PartField
                dataXPath={`${dataXPath}.days`}
                disabled={ disabled }
                max={ 30 }
            />
            <InputGroup.Append>
                <InputGroup.Text>J/M/T</InputGroup.Text>
            </InputGroup.Append>
        </InputGroup>
    )
}});
