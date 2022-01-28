import React from 'react';
import { withField } from '@cdxoo/formik-utils';
import { ButtonGroup, Button } from '@mpieva/psydb-ui-layout';
import { GenericEnum } from './generic-enum';

const enumeration = {
    keys: [ 'yes', 'no', 'unknown' ],
    labels: [ 'Ja', 'Nein', 'Unbekannt' ],
}

export const ExtBool = withField({ Control: (ps) => {
    var { dataXPath, formikField, formikForm } = ps;
    var { setFieldValue } = formikForm;
    var { value } = formikField;

    var bag = {
        value,
        onChange: (next) => setFieldValue(dataXPath, next)
    };

    return (
        <ButtonGroup className='mt-1'>
            <Yes { ...bag }>Ja</Yes>
            <No { ...bag }>Nein</No>
            <Unknown { ...bag }>Unbekannt</Unknown>
        </ButtonGroup>
    )

    //<GenericEnum enum={ enumeration } { ...ps } />
}});

var Yes = (ps) => {
    var { value, onChange } = ps;
    return (
        <YNButton
            active={ value === 'yes' }
            variant='primary'
            onClick={ () => onChange('yes') }
            { ...ps }
        />
    )
}

var No = (ps) => {
    var { value, onChange } = ps;
    return (
        <YNButton
            active={ value === 'no' }
            variant='danger'
            onClick={ () => onChange('no') }
            { ...ps }
        />
    )
}

var Unknown = (ps) => {
    var { value, onChange } = ps;
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
