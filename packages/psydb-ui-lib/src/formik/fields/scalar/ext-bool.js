import React from 'react';
import { withField } from '@cdxoo/formik-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { ButtonGroup, Button } from '@mpieva/psydb-ui-layout';
import { GenericEnum } from './generic-enum';

export const ExtBool = withField({ Control: (ps) => {
    var { dataXPath, formikField, formikForm, disabled } = ps;
    var { setFieldValue } = formikForm;
    var { value } = formikField;

    var translate = useUITranslation();

    var bag = {
        value,
        disabled,
        onChange: (next) => setFieldValue(dataXPath, next)
    };

    return (
        <ButtonGroup className='mt-1'>
            <Yes { ...bag }>{ translate('Yes') }</Yes>
            <No { ...bag }>{ translate('No') }</No>
            <Unknown { ...bag }>{ translate('Unknown') }</Unknown>
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
            active={ value === 'yes' }
            variant={ variant }
            onClick={ () => onChange('yes') }
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
            active={ value === 'no' }
            variant={ variant }
            onClick={ () => onChange('no') }
            { ...ps }
        />
    )
}

var Unknown = (ps) => {
    var { value, onChange, disabled } = ps;
    return (
        <YNButton
            active={ value === 'unknown' }
            variant='secondary'
            onClick={ () => onChange('unknown') }
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
