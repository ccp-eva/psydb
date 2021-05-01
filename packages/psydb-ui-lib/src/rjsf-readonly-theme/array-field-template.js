import React, { useState, useEffect, useReducer } from 'react';
import { InlineWrapper } from './wrapper-components';

var styles = {
    wrapper: {},
    list: {},
    item: {
        borderLeft: '3px solid #dee2e6'
    }
}

const ArrayFieldTemplate = (ps) => {
    var {
        items,
        title,
        schema,
        formData,
    } = ps;
    //console.log(ps);

    /*var Variant = subTemplates[schema.systemType];
    if (!Variant) {
        Variant = subTemplates.Plain
    }*/

    if (!items || items.length < 1) {
        return (
            <InlineWrapper label={ title }>
                <i className='text-muted'>Keine Einträge</i>
            </InlineWrapper>
        )
    }

    return (
        //<Variant { ...ps } />
        <InlineWrapper label={ title }>
            <ol className='mb-0' style={ styles.list }>
                { items.map(itemProps => (
                    <ArrayItem { ...({
                        ...itemProps,
                        schema,
                        formData,
                    })} />
                ))}
            </ol>
        </InlineWrapper>
    )
}

const ArrayItem = ({
    children
}) => {
    return (
        <li className='mb-2 pl-2'>
            <div style={ styles.item }>
                { children }
            </div>
        </li>
    );
}

export default ArrayFieldTemplate;
