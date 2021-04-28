import React from 'react';
import { utils } from "@rjsf/core";
import TextWidget from './text-widget';

const DateWidget = (ps) => (
    <TextWidget
        { ...ps }
        type='date'
    />
);

export default DateWidget;
