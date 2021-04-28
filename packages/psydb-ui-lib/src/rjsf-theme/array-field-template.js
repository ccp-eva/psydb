import React, { useState, useEffect, useReducer } from 'react';

const ArrayFieldTemplate = (ps) => {
    var {
        schema
    } = ps;

    var Variant = subTemplates[schema.systemType];
    if (!Variant) {
        Variant = subTemplates.Plain
    }

    return (
        <Variant { ...ps } />
    )
}

const DefaultArrayItem = ({ children }) => {
    return (
        <div className='bg-light border p-3'>
            { children }
        </div>
    )
}

const Plain = ({
    items,
    title,
}) => {
    return (
        <div id='ary-plain'>
            <header><b>{ title }</b></header>
            { items && items.map(itemProps => (
                <DefaultArrayItem { ...itemProps } />
            ))}
        </div>
    )
}

const subTemplates = {
    Plain,
};

export default ArrayFieldTemplate;
