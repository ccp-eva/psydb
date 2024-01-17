import React from 'react';
import { withFieldArray } from '@cdxoo/formik-utils';
import { EmailWithPrimary } from '../object';

const EmailWithPrimaryListInner = withFieldArray({
    FieldComponent: EmailWithPrimary,
    //ArrayContentWrapper: 'ObjectArrayContentWrapper',
    ArrayItemWrapper: 'ScalarArrayItemWrapper',
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

export const EmailWithPrimaryList = (ps) => {
    return (
        <EmailWithPrimaryListInner enableMove={ false } { ...ps } />
    )
}
