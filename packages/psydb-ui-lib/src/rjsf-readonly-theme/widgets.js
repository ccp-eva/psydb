import React, { useState, useEffect, useReducer } from 'react';
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
    var selectedOption = enumOptions[0];

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
