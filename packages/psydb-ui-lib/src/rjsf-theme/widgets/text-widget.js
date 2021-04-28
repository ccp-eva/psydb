import React, { useCallback } from 'react';
import { Form } from 'react-bootstrap';
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
        <Form.Group className='row ml-0 mr-0'>
            <Form.Label
                htmlFor={ id }
                className={ `${hasErrors ? 'text-danger' : ''} col-sm-3 col-form-label`}
            >
                { label || schema.title }
                {' '}
                {(label || schema.title) && required ? '*' : null}
            </Form.Label>
            <Variant
                id={ id }
                className={ `${hasErrors ? 'is-invalid' : ''} col-sm-9`}
                required={ required }
                type={ inputType }
                value={value || value === 0 ? value : ''}
                onChange={ _onChange }
                
                schema={ schema }
                formContext={ formContext }
            />
        </Form.Group>
    );

}

export default TextWidget;
