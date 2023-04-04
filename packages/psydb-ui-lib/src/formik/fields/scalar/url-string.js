import React from 'react';
import { withField } from '@cdxoo/formik-utils';
import * as Controls from '@mpieva/psydb-ui-form-controls';

export const URLString = withField({
    Control: (ps) => {
        var { formikField, formikMeta, disabled } = ps;
        var { error } = formikMeta;
        return (
            <Controls.SaneString
                type='text'
                disabled={ disabled }
                isInvalid={ !!error }
                { ...formikField }
            />
        )
    }
})

