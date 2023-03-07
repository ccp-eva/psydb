import React from 'react';
import { withField } from '@cdxoo/formik-utils';
import { UploadControl } from '../../file-upload';

export const FileUpload = withField({
    type: 'text',
    fakeDefault: '',

    Control: (ps) => {
        var {
            formikField,
            formikMeta,
            formikForm,
            dataXPath,
            label,

            labelClassName,
            formGroupClassName,

            ...pass
        } = ps;

        var { value } = formikField;
        var { setFieldValue } = formikForm;

        var bag = {
            value,
            onChange: (next) => {
                setFieldValue(dataXPath, next)
            },
            ...pass
        };
        return (
            <UploadControl { ...bag } />
        );
    }
});
