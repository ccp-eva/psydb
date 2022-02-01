import React from 'react';
import { withField } from '@cdxoo/formik-utils';
import * as Scalars from '../scalar';

const PlainCheckbox = withField({
    Control: Scalars.PlainCheckbox.Control,
    DefaultWrapper: 'NoneWrapper',
    type: 'checkbox',
    fakeDefault: false,
});

var days = [ 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun' ];
var labels = [
    'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag',
    'Samstag', 'Sonntag',
]

export const WeekdayBoolObject = withField({
    Control: (ps) => {
        var { dataXPath, disabled } = ps;

        return (
            <div className='border p-3 d-flex justify-content-between'>
                { days.map((key, index) => (
                    <PlainCheckbox
                        key={ index }
                        label={ labels[index] }
                        dataXPath={ `${dataXPath}.${key}` }
                        disabled={ disabled }
                    />
                ))}
            </div>
        )
    }
})
