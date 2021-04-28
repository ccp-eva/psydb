import React, { useCallback } from 'react';
import { Form } from 'react-bootstrap';

import { InlineWrapper } from '../utility-components';
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
   
    var { systemType } = schema;
    var Variant = variants[systemType];
    if (!Variant) {
        Variant = variants.PlainText;
    }

    var hasErrors = rawErrors.length > 0;
    var inputType = (
        (type || schema.type) === 'string'
        ?  'text' 
        : `${type || schema.type}`
    );

    var _onChange = useCallback((event) => {
        var { target: { value }} = event;
        var sanitizedValue = (
            value === ''
            ? options.emptyValue
            : value
        );
        return (
            onChange(sanitizedValue)
        );
    }, [ onChange ])

    return (
        <InlineWrapper { ...({
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
                
                schema={ schema }
                formContext={ formContext }
            />
        </InlineWrapper>
    );

}

export default TextWidget;
