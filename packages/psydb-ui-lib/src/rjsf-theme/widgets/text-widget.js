import React, { useCallback } from 'react';
import { Form } from 'react-bootstrap';

import * as wrappers from '../utility-components/wrappers';
import * as variants from './text-widget-variants';

const TextWidget = (ps) => {
    //console.log(ps);

    var {
        id,
        type,
        label,
        value,
        required,
        onChange,
        options,
        schema,
        formContext,
        rawErrors = [],
    } = ps;
   
    var {
        systemType,
        systemProps = {}
    } = schema;

    var Variant = variants[systemType];
    if (!Variant) {
        Variant = variants.PlainText;
    }

    var Wrapper = wrappers[systemProps.uiWrapper];
    if (!Wrapper) {
        Wrapper = wrappers.InlineWrapper;
    }
    

    var hasErrors = rawErrors.length > 0;
    var inputType = (
        (type || schema.type) === 'string'
        ?  'text' 
        : `${type || schema.type}`
    );

    if (schema.format === 'hex-color') {
        inputType = 'color';
    }

    var _onChange = useCallback((eventOrValue) => {
        var rawValue;
        // FIXME: this check might not be sufficient
        if (eventOrValue.target) {
            rawValue = eventOrValue.target.value;
        }
        else {
            rawValue = eventOrValue
        }
        var sanitizedValue = (
            value === ''
            ? options.emptyValue
            : rawValue
        );
        return (
            onChange(sanitizedValue)
        );
    }, [ onChange ])

    return (
        <Wrapper { ...({
            id, label, required, schema, rawErrors
        }) }>
            <Variant
                id={ id }
                hasErrors={ hasErrors }
                className={ `${hasErrors ? 'is-invalid' : ''}`}
                required={ required }
                type={ inputType }
                value={value || value === 0 ? value : ''}
                onChange={ _onChange }
                options={ options }
                
                schema={ schema }
                formContext={ formContext }
            />
        </Wrapper>
    );

}

export default TextWidget;
