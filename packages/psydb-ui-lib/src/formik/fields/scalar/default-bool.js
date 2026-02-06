import React from 'react';
import { withField } from '@cdxoo/formik-utils';
import { useUIConfig, useI18N } from '@mpieva/psydb-ui-contexts';
import { ButtonGroup, Button } from '@mpieva/psydb-ui-layout';

export const DefaultBool = withField({ Control: (ps) => {
    var {
        dataXPath,
        formikField,
        formikForm,
        extraOnChange,
        disabled
    } = ps;
    var { setFieldValue } = formikForm;
    var { value } = formikField;

    var [{ translate }] = useI18N();

    var bag = {
        value,
        onChange: (next) => {
            extraOnChange && extraOnChange(next);
            setFieldValue(dataXPath, next);
        },
        disabled,
    };

    return (
        <ButtonGroup className='mt-1'>
            <Yes { ...bag }>{ translate('Yes') }</Yes>
            <No { ...bag }>{ translate('No') }</No>
        </ButtonGroup>
    )

}});

var Yes = (ps) => {
    var { value, onChange, disabled } = ps;
    var { branding } = useUIConfig();
    
    var variant = (
        branding?.options?.useSuccessColorForYesValues
        ? 'success'
        : 'primary'
    );

    if (disabled) {
        variant = 'secondary';
    }
    
    return (
        <YNButton
            active={ value === true }
            variant={ variant }
            onClick={ () => onChange(true) }
            { ...ps }
        />
    )
}

var No = (ps) => {
    var { value, onChange, disabled } = ps;
    var variant = (
        disabled
        ? 'secondary'
        : 'danger'
    );
    return (
        <YNButton
            active={ value === false }
            variant={ variant }
            onClick={ () => onChange(false) }
            { ...ps }
        />
    )
}

var YNButton = (ps) => {
    var { variant, active, ...pass } = ps;
    return (
        <Button
            size='sm'
            variant={ active ? variant : 'outline-secondary' }
            style={{ minWidth: '60px' }} { ...pass }
        />
    )
}
