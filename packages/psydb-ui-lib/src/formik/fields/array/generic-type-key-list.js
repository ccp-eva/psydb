import React from 'react';
import { withField, withFieldArray } from '@cdxoo/formik-utils';
import { GenericTypeKey } from '../scalar';

const GenericTypeKeyListArray = withFieldArray({
    FieldComponent: GenericTypeKey,
    ArrayItemWrapper: 'ScalarArrayItemWrapper',
});

export const GenericTypeKeyList = withField({
    Control: (ps) => {
        var { formikField } = ps;
        var { value = [] } = formikField;

        return (
            <GenericTypeKeyListArray
                { ...ps }
                existingTypes={ value }
                enableMove={ false }
            />
        )
    },
    DefaultWrapper: 'NoneWrapper',
})
