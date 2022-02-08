import React from 'react';
import { withField } from '@cdxoo/formik-utils';
import * as CoreFields from '../fields';

export const IntegerInterval = withField({ Control: (ps) => {
    var { dataXPath } = ps;
    return (
        <div className='d-flex border p-3'>
            <div className='w-50 flex-grow'>
                <CoreFields.Integer
                    dataXPath={`${dataXPath}.min`}
                    label='Minimum'
                    formGroupClassName='mb-0'
                />
            </div>
            <div className='w-50 flex-grow'>
                <CoreFields.Integer
                    dataXPath={`${dataXPath}.max`}
                    label='Maximum'
                    formGroupClassName='mb-0'
                />
            </div>
        </div>
    );
}});
