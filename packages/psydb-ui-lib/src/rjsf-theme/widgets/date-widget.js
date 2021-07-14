import React from 'react';
import { utils } from "@rjsf/core";
import TextWidget from './text-widget';
import datefns from '../../date-fns';

const DateWidget = (ps) => {
    var { value } = ps;

    // FIXME: this is hacky
    // also we are sending data doesnt actually conform to the schema
    if (value && value.endsWith('Z')) {
        var d = new Date(value);
        value = datefns.format(d, 'yyyy-MM-dd')
    }
    return <TextWidget
        { ...ps }
        value={ value }
        type='date'
    />
};

export default DateWidget;
