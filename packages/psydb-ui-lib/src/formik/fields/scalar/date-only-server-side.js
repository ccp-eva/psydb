import React, { useState, useContext } from 'react';
import { Form } from '@mpieva/psydb-ui-layout';
import ServerTimezoneContext from '../../../server-timezone-context';
import WithField from '../../with-field';

const removeTimezone = (str, offsetMinutes) => {
    if (typeof str === 'string') {
        var date = new Date(str);
        if (!isNaN(date.getTime())) {
            var offsetMillis = (
                date.getTimezoneOffset() * offsetMinutes * 1000
            );
            str = new Date(date.getTime() + offsetMillis).toISOString();
        }
    }
    return str;
}

const splitISO = (value) => {
    var date, time, fraction;
    if (typeof value === 'string') {
        var match = value.match(/^(.*)T(\d\d:\d\d:\d\d)\.(\d{3})Z$/);
        if (match) {
            ([ date, time, fraction ] = match.slice(1))
        }
    }

    return { date, time, fraction };
}

export const DateOnlyServerSide = WithField({
    Control: (ps) => {
        var { dataXPath, formikField, formikForm, disabled } = ps;
        var { value } = formikField;
        var { setFieldValue } = formikForm;
    
        var serverTimezoneOffset = useContext(ServerTimezoneContext);

        var { date } = splitISO(removeTimezone(value, serverTimezoneOffset));
        var [ cachedDate, setCachedDate ] = useState(date || '');

        var handleChange = (event) => {
            var { target: { value }} = event;
            setCachedDate(value);

            var date = value;
            if (date) {
                // FIXME: summer vs winter time
                var fakeISOString = `${date}T12:00:00.000Z`;
                var fakeDate = new Date(fakeISOString);

                if (!isNaN(fakeDate.getTime())) {
                    //var localOffset = fakeDate.getTimezoneOffset();
                    //var delta = localOffset - serverTimezoneOffset;
                    /*var iso = removeTimezone(
                        fakeISOString,
                        serverTimezoneOffset
                    );*/
                    //console.log({ fakeISOString })
                    setFieldValue(dataXPath, fakeISOString);
                }
                else {
                    console.log('INVALID');
                    setFieldValue(dataXPath, 'INVALID');
                }
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

