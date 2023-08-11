import React from 'react';
import { withFieldArray } from '@cdxoo/formik-utils';
import { EmailWithPrimary } from '../object';

export const EmailWithPrimaryList = withFieldArray({
    FieldComponent: EmailWithPrimary,
    ArrayContentWrapper: 'ObjectArrayContentWrapper',
    ArrayItemWrapper: 'ObjectArrayItemWrapper',
    defaultItemValue: (ps) => {
        var { formikField } = ps;
        var { value = [] } = formikField;
        
        if (value.length === 0) {
            return { isPrimary: true };
        }
        else {
            return { isPrimary: false };
        }
    }
});
