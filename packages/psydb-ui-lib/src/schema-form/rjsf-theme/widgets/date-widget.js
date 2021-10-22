import React, { useEffect } from 'react';
import { utils } from "@rjsf/core";
import TextWidget from './text-widget';
import datefns from '../../../date-fns';

const DateWidget = (ps) => {
    var { value } = ps;

    // FIXME: this is hacky
    // also we are sending data doesnt actually conform to the schemaa
    // FIXME: this doesnt work when there are more than one date
    // only server side values in the form
    /*useEffect(() => {
        if (value && value.endsWith('Z')) {
            var d = new Date(value);
            value = datefns.format(d, 'yyyy-MM-dd');
            // I also need to call onChange since otherwise the form data
            // is invalid
            ps.onChange(value);
        }
    })
    if (value && value.endsWith('Z')) {
        return null;
    }*/

    return <TextWidget
        { ...ps }
        value={ value }
        type='date'
    />
};

export default DateWidget;
