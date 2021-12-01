import React from 'react';
import { Form, FormHelpers } from '@mpieva/psydb-ui-layout';
import WithField from '../with-field';

export const PlainCheckbox = WithField({
    Control: (ps) => {
        var { formikField, disabled, label } = ps;
        return (
            <Form.Check
                label={ label }
                disabled={ disabled }
                { ...formikField }
            />
        )
    },
    type: 'checkbox',
    fakeDefault: false,
    DefaultWrapper: FormHelpers.NoneWrapper
})

export const GenericMultiCheckbox = WithField({ Control: (ps) => {
    var {
        dataXPath,
        options
    } = ps;

    // FIXME: col-form label is to get the padding right
    return (
        <div className='col-form-label d-flex'>
            { Object.keys(options).map((key) => (
                <div key={ key } className='mr-3'>
                    <PlainCheckbox
                        dataXPath={ `${dataXPath}.${key}` }
                        label={ options[key] }
                    />
                </div>
            ))}
        </div>
    )
}})
