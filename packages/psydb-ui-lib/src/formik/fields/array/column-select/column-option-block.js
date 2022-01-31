import React from 'react';
import { withField } from '@cdxoo/formik-utils';
import * as Controls from '@mpieva/psydb-ui-form-controls';

export const ColumnOptionBlock = (ps) => {
    var { dataXPath, columns } = ps;
    return (
        <div className='d-flex flex-wrap mb-3'>
            { columns.map((col, index) => (
                <div key={ col.pointer } className='w-50'>
                    <ColumnField dataXPath={ dataXPath } { ...col } />
                </div>
            ))}
        </div>
    )
}

const ColumnField = withField({
    Control: (ps) => {
        var { dataXPath, pointer, label, formikField, formikForm } = ps;
        var { value } = formikField;
        var { setFieldValue } = formikForm;

        var hasPointer = value.includes(pointer);

        var onChange = (didSelect) => {
            if (didSelect === true) {
                setFieldValue(dataXPath, [ ...value, pointer ]);
            }
            else {
                setFieldValue(dataXPath, value.filter(it => it !== pointer))
            }
        }

        return (
            <div>
                <Controls.PlainCheckbox
                    id={ `${dataXPath}.${pointer}` }
                    label={ label }
                    value={ hasPointer }
                    onChange={ onChange }
                />
            </div>
        )
    },
    fakeDefault: [],
    DefaultWrapper: 'NoneWrapper'
})

