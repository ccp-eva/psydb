import React from 'react';
import { Form, FormHelpers } from '@mpieva/psydb-ui-layout';
import { withField } from '@cdxoo/formik-utils';
import { PlainCheckbox } from './plain-checkbox';

export const GenericMultiCheckbox = withField({ Control: (ps) => {
    var {
        dataXPath,
        options
    } = ps;

    // FIXME: col-form label is to get the padding right
    return (
        <div className='col-form-label d-flex'>
            { Object.keys(options).map((key) => (
                <div key={ key } className='mr-3'>
                    <PlainCheckbox
                        dataXPath={ `${dataXPath}.${key}` }
                        label={ options[key] }
                    />
                </div>
            ))}
        </div>
    )
}})
