import React from 'react';
import ReactDateTime from 'react-datetime';
import classnames from 'classnames';

import { withField } from '@cdxoo/formik-utils';
import { useUITranslation, useUILocale } from '@mpieva/psydb-ui-contexts';

const Control = (ps) => {
    var { dataXPath, formikField, formikMeta, disabled } = ps;
    var { error } = formikMeta;
    var { value, onChange } = formikField;

    var locale = useUILocale();
    var translate = useUITranslation();

    var isValidDate = (
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(value)
        && !isNaN(new Date(value).getTime())
    );

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
            locale={ locale.code }
            inputProps={{
                className: inputClassName,
                disabled,
                placeholder: translate('_date_time_placeholder')
            }}
        />
    )
}


export const DateTime = withField({
    Control,
})
