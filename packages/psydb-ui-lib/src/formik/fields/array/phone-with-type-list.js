import React from 'react';
import { withFieldArray } from '@cdxoo/formik-utils';
import { PhoneWithType } from '../object';

const PhoneWithTypeListInner = withFieldArray({
    FieldComponent: PhoneWithType,
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

export const PhoneWithTypeList = (ps) => {
    return (
        <PhoneWithTypeListInner enableMove={ false } { ...ps } />
    )
}
