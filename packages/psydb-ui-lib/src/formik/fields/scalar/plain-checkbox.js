import React from 'react';
import { withField } from '@cdxoo/formik-utils';
import * as Controls from '@mpieva/psydb-ui-form-controls';

export const PlainCheckbox = withField({
    Control: (ps) => {
        var { dataXPath, formikField, disabled, label } = ps;
        return (
            <Controls.PlainCheckbox
                useRawOnChange
                id={ dataXPath }
                label={ label }
                disabled={ disabled }
                { ...formikField }
            />
        )
    },
    type: 'checkbox',
    fakeDefault: false,
    DefaultWrapper: 'NoneWrapper'
})

