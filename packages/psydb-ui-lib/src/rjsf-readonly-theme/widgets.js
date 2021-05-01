import React, { useState, useEffect, useReducer } from 'react';

import {
    CheckSquare,
    Square
} from 'react-bootstrap-icons';

import { InlineWrapper } from './wrapper-components';
import * as textWidgetVariants from './text-widget-variants';

const styles = {
    bold: { fontWeight: '500' }
}

export const TextWidget = (ps) => {
    var { label, value, schema } = ps;
    
    var {
        systemType,
        systemProps = {}
    } = schema;

    var Variant = textWidgetVariants[systemType];
    if (!Variant) {
        Variant = textWidgetVariants.PlainText;
    }

    return (
        <Variant { ...ps } />
    )
}

export const SelectWidget = (ps) => {
    var {
        label,
        value,
        options,
        isMultiSchemaSelector,
        baseSchema,
    } = ps;


    var { enumOptions } = options;
    var selectedOption = enumOptions.find(it => it.value === value);

    if (isMultiSchemaSelector) {
        label = label || baseSchema.title || '';   
    }

    return (
        <InlineWrapper label={ label }>
            {
                selectedOption
                ? (
                    <b style={ styles.bold }>{ selectedOption.label }</b>
                )
                : (
                    <i className='text-muted'>
                        Nicht gewählt
                    </i>
                )
            }
        </InlineWrapper>
    );
}

export const CheckboxWidget = (ps) => {
    var { label, value } = ps;
    return (
        <InlineWrapper>
            <div className='d-flex'>
                <div>
                    {
                        value
                        ? <CheckSquare />
                        : <Square />
                    }
                </div>
                <span className='pl-2 align-middle'>
                    { label }
                </span>
            </div>
        </InlineWrapper>
    )
}
