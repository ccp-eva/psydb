import React from 'react';
import { withFieldArray } from '@cdxoo/formik-utils';
import { PhoneWithType } from '../object';

const PhoneWithTypeListInner = withFieldArray({
    FieldComponent: PhoneWithType,
    //ArrayContentWrapper: 'ObjectArrayContentWrapper',
    ArrayItemWrapper: 'ScalarArrayItemWrapper',
    defaultItemValue: (ps) => ({}),
});

export const PhoneWithTypeList = (ps) => {
    return (
        <PhoneWithTypeListInner enableMove={ false } { ...ps } />
    )
}
