import React from 'react';
import { withField } from '@cdxoo/formik-utils';

import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';

export const QuillHTML = withField({
    Control: (ps) => {
        var { dataXPath, formikField, formikForm, disabled } = ps;
        var { value } = formikField;
        var { setFieldValue } = formikForm;

        return (
            <div className='bg-white'>
                <ReactQuill
                    value={ value || '' }
                    readOnly={ disabled }
                    onChange={ (next) => setFieldValue(dataXPath, next) }
                />
            </div>
        )
    }
})
