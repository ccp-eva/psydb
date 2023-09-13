import React from 'react';
import { withField } from '@cdxoo/formik-utils';
import { useUILocale } from '@mpieva/psydb-ui-contexts';
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

        var locale = useUILocale();
        return (
            <div className='border p-3 d-flex justify-content-between'>
                { days.map((key, ix) => (
                    <PlainCheckbox
                        key={ ix }
                        label={(
                            locale.localize.day(ix + 1, { width: 'wide' })
                        )}
                        dataXPath={ `${dataXPath}.${key}` }
                        disabled={ disabled }
                    />
                ))}
            </div>
        )
    }
})
