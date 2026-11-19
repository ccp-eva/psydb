import React from 'react';
import { withField } from '@cdxoo/formik-utils';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import * as CoreFields from '../fields';

export const IntegerInterval = withField({ Control: (ps) => {
    var { dataXPath } = ps;
    var [{ translate }] = useI18N();
    return (
        <div className='d-flex border p-3'>
            <div className='w-50 flex-grow'>
                <CoreFields.Integer
                    dataXPath={`${dataXPath}.min`}
                    label={ translate('Minimum') }
                    formGroupClassName='mb-0'
                />
            </div>
            <div className='w-50 flex-grow'>
                <CoreFields.Integer
                    dataXPath={`${dataXPath}.max`}
                    label={ translate('Maximum') }
                    formGroupClassName='mb-0'
                />
            </div>
        </div>
    );
}});
