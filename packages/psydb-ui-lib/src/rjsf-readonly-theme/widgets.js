import React, { useState, useEffect, useReducer } from 'react';
import { InlineWrapper } from './wrapper-components';

export const TextWidget = (ps) => {
    var { label, value } = ps;
    return (
        <InlineWrapper label={ label }>
            { value }
        </InlineWrapper>
    )
}

export const SelectWidget = (ps) => {
    var { value } = ps;
    return (
        <div>select { value }</div>
    );
}
