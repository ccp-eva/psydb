import React from 'react';
import { utils } from "@rjsf/core";
import TextWidget from './text-widget';

const DateTimeWidget = ({ value, onChange, ...other }) => (
    <TextWidget
        { ...other }
        type='datetime-local'
        value={ utils.utcToLocal(value) }
        onChange={ (value) => onChange(utils.localToUTC(value))}
    />
);

export default DateTimeWidget;
