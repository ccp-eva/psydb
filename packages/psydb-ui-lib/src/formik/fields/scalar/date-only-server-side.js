import React, { useState, useContext } from 'react';
import { withField } from '@cdxoo/formik-utils';
import { getSystemTimezone } from '@mpieva/psydb-timezone-helpers';

import {
    splitISO,
    checkDate,
    canSwap,
    createInitialDate,
    canParseBack,
    parseBack,
} from '../../../date-only-helpers';

import { Form } from '@mpieva/psydb-ui-layout';
import ServerTimezoneContext from '../../../server-timezone-context';

export const DateOnlyServerSide = withField({
    Control: (ps) => {
        var {
            dataXPath,
            formikField,
            formikForm,
            disabled,
            isInitialValueSwapped = true,
        } = ps;
        var { value } = formikField;
        var { setFieldValue } = formikForm;
    
        var serverTimezone = useContext(ServerTimezoneContext);
        var clientTimezone = getSystemTimezone();

        var initialDate = createInitialDate({
            value,
            serverTimezone,
            clientTimezone,
            isInitialValueSwapped
        });

        //console.log({
        //    value,
        //    initialDate
        //});

        var [ cachedDate, setCachedDate ] = useState(initialDate || '');

        var handleChange = (event) => {
            var { target: { value }} = event;
            setCachedDate(value);

            if (canParseBack(value)) {
                var date = parseBack(value);

                console.log({ date: date.toISOString() });
                setFieldValue(dataXPath, date.toISOString());
            }
            else {
                console.log('INVALID')
                setFieldValue(dataXPath, 'INVALID');
            }
        }

        return (
            <Form.Control
                type='date'
                disabled={ disabled }
                { ...formikField }
                value={ cachedDate }
                onChange={ handleChange }
            />
        )
    }
})

