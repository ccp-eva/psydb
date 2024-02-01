import React from 'react';
import { withField } from '@cdxoo/formik-utils';
import * as Controls from '@mpieva/psydb-ui-form-controls';

export const GenericTypeKey = withField({ Control: (ps) => {
    var {
        dataXPath,
        formikField,
        formikMeta,
        formikForm,

        manualOnChange,
        extraOnChange,
        // FIXME: this is the earliest place to prevent
        // this from being passed down to select which will
        // give big prop warning; see Address
        labelClassName,
        ...pass
    } = ps;
    
    var { error } = formikMeta;
    var { setFieldValue } = formikForm;
    var { value } = formikField;

    //FIXME: redundandt with generic enum field
    return (
        <Controls.GenericTypeKey
            useRawOnChange={ !!manualOnChange }
            onChange={ (
                manualOnChange
                ? manualOnChange
                : (next) => {
                    extraOnChange && extraOnChange(next);
                    setFieldValue(dataXPath, next)
                }
            )}
            value={ value }
            //options={ downstreamOptions }
            isInvalid={ !!error }
            { ...pass }
        />
    );
}})
