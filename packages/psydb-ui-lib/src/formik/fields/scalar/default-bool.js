import React from 'react';
import { withField } from '@cdxoo/formik-utils';
import { ButtonGroup, Button } from '@mpieva/psydb-ui-layout';
import { GenericEnum } from './generic-enum';

export const DefaultBool = withField({ Control: (ps) => {
    var { dataXPath, formikField, formikForm, disabled } = ps;
    var { setFieldValue } = formikForm;
    var { value } = formikField;

    var bag = {
        value,
        disabled,
        onChange: (next) => setFieldValue(dataXPath, next)
    };

    return (
        <ButtonGroup className='mt-1'>
            <Yes { ...bag }>Ja</Yes>
            <No { ...bag }>Nein</No>
        </ButtonGroup>
    )

}});

var Yes = (ps) => {
    var { value, onChange, disabled } = ps;
    var variant = (
        disabled
        ? 'secondary'
        : 'primary'
    );
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
