import React from 'react';
import { withField } from '@cdxoo/formik-utils';
import * as CoreFields from '../fields';
import { PlainCheckbox } from './plain-checkbox';

export const ForeignIdList = withField({ Control: (ps) => {
    var { dataXPath } = ps;
    return (
        <div className='border p-3'>
            <CoreFields.ForeignIdList
                { ...ps }
                contentFallbackLabel='Keine Bedingungen'
                contentClassName='m-0 p-0'
                noWrapper={ true }
                dataXPath={ `${dataXPath}.values` }
                label='Werte'
            />
            <hr />
            <PlainCheckbox
                dataXPath={ `${dataXPath}.negate` }
                label='Nicht mit diesen Werten'
            />
        </div>
    )
}});
