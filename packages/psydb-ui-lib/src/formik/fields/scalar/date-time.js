import React from 'react';
import ReactDateTime from 'react-datetime';
import classnames from 'classnames';

import { withField } from '@cdxoo/formik-utils';

const Control = (ps) => {
    var { dataXPath, formikField, formikMeta, disabled } = ps;
    var { error } = formikMeta;
    var { value, onChange } = formikField;
    var isValidDate = !isNaN(new Date(value).getTime());

    var inputClassName = classnames([
        'form-control',
        !!error && 'is-invalid'
    ]);
    return (
        <ReactDateTime
            value={ isValidDate ? new Date(value) : value }
            onChange={ (stringOrMomentInstance) => {
                var v = '';
                if (stringOrMomentInstance.toISOString) {
                    v = stringOrMomentInstance.toISOString();
                }
                else {
                    v = String(stringOrMomentInstance);
                }
                return onChange(dataXPath)(v);
            }}
            locale='de-DE'
            inputProps={{
                className: inputClassName,
                disabled,
                placeholder: 'tt.mm.jjjj --:--'
            }}
        />
    )
}


export const DateTime = withField({
    Control,
})
